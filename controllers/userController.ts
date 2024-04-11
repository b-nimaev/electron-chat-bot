import { Request, Response } from "express";
import ActivationKey, { ActivationKeyModel } from "../models/ActivationKey";
import OpenAI from "openai";
import User from "../models/User";
import dotenv from "dotenv";
dotenv.config();
const openai = new OpenAI({
  apiKey: process.env["openai"], // This is the default and can be omitted
});

async function createCompletion(content: string, userId: string) {
  const user = await User.findOne({ machineId: userId });

  if (user) {
    if (user.subscription) {
      if (
        user.subscription.freeUse > 0 ||
        user.subscription.status === "active"
      ) {
        const chatCompletion = await openai.chat.completions.create({
          messages: [{ role: "user", content }],
          model: "gpt-3.5-turbo",
        });

        if (user.subscription.freeUse > 0) {
          user.subscription.freeUse -= 1; // Уменьшаем freeUse на 1
          await user.save(); // Сохраняем изменения в документе пользователя
        }

        return chatCompletion.choices[0].message.content;
      }
    }
  }
}

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { machineId } = req.params; // Function to generate a random key

    const user = await User.findOne({
      machineId,
    });

    if (!user) {
      await createUser(machineId);
      const createdUser = await User.findOne({ machineId });
      res.status(201).json({ user: createdUser })
      return
    }

    res.status(201).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

const createUser = async (machineId: string) => {
  const newUser = new User({
    machineId,
    subscription: {
      //   expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Срок истечения подписки через 30 дней
      expiresAt: new Date(Date.now() * 1000), // Срок истечения подписки через 30 дней
      status: "expired",
      freeUse: 20,
    },
  });

  try {
    const savedUser = await newUser.save();
    console.log("User created:", savedUser);
  } catch (error) {
    console.error("Error creating user:", error);
  }
};
