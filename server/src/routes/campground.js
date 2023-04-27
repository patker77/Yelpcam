import express from "express";
import {
  editCamp,
  createCampForm,
  createCamp,
  index,
  getCamp,
  editCampForm,
  deleteCamp,
} from "../controllers/campgrounds.js";
const router = express.Router();
import { handleAsync } from "../utils/handleError.js";
import { isCampAuthor, isLoggedIn, validateCamps } from "../utils/middleware.js";

router
  .route("/")
  .get(handleAsync(index))
  .post(isLoggedIn, validateCamps, handleAsync(createCamp));

router.get("/new", isLoggedIn, createCampForm);

router
  .route("/:id")
  .get(handleAsync(getCamp))
  .put(isLoggedIn, validateCamps,isCampAuthor, handleAsync(editCamp))
  .delete(isLoggedIn,isCampAuthor, handleAsync(deleteCamp));

router.get("/:id/edit", isLoggedIn,isCampAuthor, handleAsync(editCampForm));

export default router;
