const midtransClient = require("midtrans-client");
const { Payment, Collection } = require("../models");

module.exports = class Controller {
    static async createTransaction(req, res, next) {
        try {
            const { movieId, title, price } = req.body;

            if (!movieId || !title || !price) {
                throw { name: "Bad Request", message: "movieId, title, and price are required" };
            }

            // Cek apakah movie sudah ada di collection user
            const existingCollection = await Collection.findOne({
                where: {
                    UserId: req.user.id,
                    MovieId: movieId,
                },
            });

            if (existingCollection) {
                throw { name: "Bad Request", message: "You already own this movie" };
            }

            // Buat Snap client
            let snap = new midtransClient.Snap({
                isProduction: false,
                serverKey: process.env.MIDTRANS_SERVER_KEY,
            });

            const orderId = "ORDER-" + Date.now() + "-" + req.user.id;

            // Ambil harga dari request
            const amount = price;

            const parameter = {
                transaction_details: {
                    order_id: orderId,
                    gross_amount: amount,
                },
                item_details: [
                    {
                        id: movieId,
                        price: amount,
                        quantity: 1,
                        name: title,
                    },
                ],
                customer_details: {
                    email: req.user.email,
                    first_name: req.user.email.split("@")[0],
                },
            };

            const transaction = await snap.createTransaction(parameter);

            // Simpan payment dengan status pending
            await Payment.create({
                OrderId: orderId,
                UserId: req.user.id,
                MovieId: movieId,
                amount: amount,
                status: "pending",
                transactionDetails: JSON.stringify(transaction),
            });

            await Collection.create({
                UserId: req.user.id,
                MovieId: movieId,
            });

            res.status(201).json({
                snapToken: transaction.token,
                redirectUrl: transaction.redirect_url,
                orderId: orderId,
            });
        } catch (err) {
            console.log("🚀 ~ createTransaction ~ err:", err);
            next(err);
        }
    }

    static async handleNotification(req, res, next) {
        try {
            const notification = req.body;
            console.log(notification, "<<< notification");


            const coreApi = new midtransClient.CoreApi({
                isProduction: false,
                serverKey: process.env.MIDTRANS_SERVER_KEY,
            });

            const transactionStatus = await coreApi.transaction.notification(notification);
            console.log(transactionStatus, "<<<< transaction status");

            const orderId = transactionStatus.order_id;
            const paymentStatus = transactionStatus.transaction_status;

            console.log("[Midtrans Webhook]", { orderId, paymentStatus });

            // Update status pembayaran berdasarkan webhook Midtrans
            await Payment.update(
                { status: paymentStatus },
                { where: { OrderId: orderId } }
            );

            res.status(200).json({ status: "OK", orderId, paymentStatus });
        } catch (err) {
            console.log("🚀 ~ handleNotification ~ err:", err);
            res.status(500).json({ message: "Error processing webhook" });
        }
    }
}