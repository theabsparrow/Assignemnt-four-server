import { Request, Response } from 'express';
import { orderService } from './order.service';

// create an order
const createOrder = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const result = await orderService.createOrder(payload);

    res.status(200).json({
      success: true,
      message: 'Order created successfully',
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message:
        error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

// calculate the total reveneu
const totalReveneu = async (req: Request, res: Response) => {
  try {
    const result = await orderService.totalReveneu();
    res.status(200).json({
      success: true,
      message: 'total reveneu calculated successfully',
      totalReveneu: result,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: 'something went wrong',
      error: error,
    });
  }
};

export const orderController = {
  createOrder,
  totalReveneu,
};
