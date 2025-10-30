import express  from "express";
import upload from "../middleware/uploadMiddlewear.js";
import { protect } from "../middleware/authMiddleware.js";
import { createRoom, getOwnerRoom, getRooms, toggleRoomAvailability } from "../controllers/RoomController.js";

const roomRouter = express.Router();

roomRouter.post("/", upload.array('images', 4),protect,createRoom)
roomRouter.get("/",getRooms);
roomRouter.get("/owner",protect,getOwnerRoom);
roomRouter.post("/toggle-availability",protect,toggleRoomAvailability);

export default roomRouter;