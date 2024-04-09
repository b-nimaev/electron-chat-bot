import { Request, Response } from "express";
import ActivationKey, { ActivationKeyModel } from "../models/ActivationKey";

export const generateActivationKey = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const key = generateKey(); // Function to generate a random key
    const activationKey = new ActivationKey({ key });
    await activationKey.save();
    res.status(201).json({ key });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

export const activateKey = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { key } = req.body;
  try {
    const activationKey: ActivationKeyModel | null =
      await ActivationKey.findOne({ key });
    if (!activationKey) {
      res.status(404).json({ message: "Activation key not found" });
      return;
    }
    if (activationKey.isActivated) {
      res.status(400).json({ message: "Activation key already used" });
      return;
    }
    activationKey.isActivated = true;
    await activationKey.save();
    res.status(200).json({ message: "Activation key successfully used" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

function generateKey(): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const keyLength = 10; // Длина ключа, которую вы хотите сгенерировать
  let key = "";
  for (let i = 0; i < keyLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    key += characters.charAt(randomIndex);
  }
  return key;
}

