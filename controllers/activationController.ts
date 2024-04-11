import { Request, Response } from "express";
import ActivationKey, { ActivationKeyModel } from "../models/ActivationKey";
import User from "../models/User";

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
  const { key, machineId } = req.body;
  try {
    // Поиск пользователя по machineId
    const user = await User.findOne({ machineId });
    if (!user) {
      res.status(404).json({ status: false, message: "User not found" });
      return;
    }

    // Поиск ключа активации
    const activationKey: ActivationKeyModel | null =
      await ActivationKey.findOne({ key });
    if (!activationKey) {
      res
        .status(404)
        .json({ status: false, message: "Activation key not found" });
      return;
    }

    // Проверка, использовался ли ключ ранее
    if (activationKey.isActivated) {
      res
        .status(400)
        .json({ status: false, message: "Activation key already used" });
      return;
    }

    // Активация ключа
    activationKey.isActivated = true;
    await activationKey.save();

    if (user && user.subscription) {
      user.subscription.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      user.subscription.status = "active";
      // Предполагая, что есть поле freeUse, его тоже можно обновить таким же образом
      // user.subscription.freeUse = обновленное_значение;

      await user.save();
    }

    res
      .status(200)
      .json({ status: true, message: "Activation key successfully used" });
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

