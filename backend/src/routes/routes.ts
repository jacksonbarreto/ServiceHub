import { Router } from "express";
import {UserController} from "../controllers/UserController";
import {UserService} from "../services/UserService";
import {userRepository} from '../repositories/userRepository';
import {AuthController} from "../controllers/AuthController";
import {AuthService} from "../services/AuthService";
import {AuthMiddleware} from "../middlewares/authMiddleware";
import {TokenBlacklistService} from "../services/TokenBlacklistService";
import {AutomationController} from "../controllers/AutomationController";
import {automationRepository} from "../repositories/automationRepository";
import {AutomationService} from "../services/AutomationService";
import {ImageController} from "../controllers/ImageController";
import {ImageService} from "../services/ImageService";
import upload from "../helpers/multer-config";

const userController = new UserController(new UserService(userRepository));
const tokenBlacklistService = new TokenBlacklistService();
const authController = new AuthController(new AuthService(userRepository, tokenBlacklistService))
const automationsController = new AutomationController(new AutomationService(automationRepository));
const imageService = new ImageService();
const imageController = new ImageController(imageService)
const authMiddleware =  AuthMiddleware.getInstance(userRepository, tokenBlacklistService);


const userRoutes = Router();
userRoutes.post('/', userController.create.bind(userController));
userRoutes.patch('/', authMiddleware.use.bind(authMiddleware), userController.update.bind(userController));

const authRoutes = Router();
authRoutes.post('/login', authController.login.bind(authController));
authRoutes.post('/refresh', authController.refresh.bind(authController));
authRoutes.get('/is-authenticated', authController.isAuthenticated.bind(authController));
authRoutes.post('/logout',  authMiddleware.use.bind(authMiddleware), authController.logout.bind(authController));

const automationsRoutes = Router();
automationsRoutes.post('/', authMiddleware.use.bind(authMiddleware), automationsController.create.bind(automationsController));
automationsRoutes.patch('/', authMiddleware.use.bind(authMiddleware), automationsController.update.bind(automationsController));
automationsRoutes.patch('/swap', authMiddleware.use.bind(authMiddleware), automationsController.swapPosition.bind(automationsController));
automationsRoutes.delete('/', authMiddleware.use.bind(authMiddleware), automationsController.delete.bind(automationsController));
automationsRoutes.get('/', authMiddleware.use.bind(authMiddleware), automationsController.readAll.bind(automationsController));
automationsRoutes.get('/:id', authMiddleware.use.bind(authMiddleware), automationsController.read.bind(automationsController));

const imagesRoutes = Router();
imagesRoutes.get('/:path', authMiddleware.use.bind(authMiddleware), imageController.read.bind(imageController));
imagesRoutes.post('/upload', authMiddleware.use.bind(authMiddleware), upload.single('image'), imageController.create.bind(imageController));

const routes = Router();
routes.use('/user', userRoutes);
routes.use('/auth', authRoutes);
routes.use('/automation', automationsRoutes);
routes.use('/image', imagesRoutes);

export default routes;