import express from "express";
import { pagingParse } from "../middleware/paging.middleware.js";
import {
  changeStatusProduct,
  changeStatusProductCategory,
  createCategory,
  createProduct,
  deleteCategory,
  deleteProduct,
  getCapacityProduct,
  getCategoryWithPaging,
  getDetailCategory,
  getDetailProduct,
  getListCategory,
  getListProduct,
  getProductBySlug,
  updateCategory,
  updateProduct,
} from "../services/product.service.js";

import {
  changeStatusProductValidator,
  createCategoryValidator,
  createProductValidator,
  updateCategoryValidator,
  updateProductValidator,
} from "../validator/product.validator.js";

import { MODULE } from "../constants/common.constant.js";
import HttpStatusCode from "../errors/HttpStatusCode.js";
const product = express.Router();

/**
 * ================ CONTORLLER PRODUCT ====================
 */
product.get(
  "/",
  [pagingParse({ column: "id", dir: "desc" })],
  (req, res, next) => {
    return getListProduct(req.query, req.paging)
      .then((t) => res.status(HttpStatusCode.OK).json(t))
      .catch(next);
  }
);

product.get("/detail-product/:id", (req, res, next) => {
  return getDetailProduct(req.params.id)
    .then((t) => res.status(HttpStatusCode.OK).json(t))
    .catch(next);
});

product.post(
  "/new-product",

  [createProductValidator],
  (req, res, next) => {
    return createProduct(req.body)
      .then((t) => res.status(HttpStatusCode.OK).json(t))
      .catch(next);
  }
);

product.put(
  "/update-product",

  [updateProductValidator],
  (req, res, next) => {
    return updateProduct(req.body)
      .then((t) => res.status(HttpStatusCode.OK).json(t))
      .catch(next);
  }
);

product.put(
  "/change-status-product",
  [changeStatusProductValidator],
  (req, res, next) => {
    return changeStatusProduct(req.body)
      .then((t) => res.status(HttpStatusCode.OK).json(t))
      .catch(next);
  }
);
product.get("/get-by-slug", (req, res, next) => {

  return getProductBySlug(req.query)
    .then((t) => res.status(HttpStatusCode.OK).json(t))
    .catch(next);
});

product.get("/get-capacity-product", (req, res, next) => {
  console.log("test", req.body);
  return getCapacityProduct(req.body)
    .then((t) => res.status(HttpStatusCode.OK).json(t)) 
    .catch(next);
});

product.delete(
  "/delete-product/:id",

  (req, res, next) => {
    return deleteProduct(req.params.id)
      .then((t) => res.status(HttpStatusCode.OK).json(t))
      .catch(next);
  }
);

/**
 * ================ CONTORLLER CATEGORY ====================
 */
product.get("/get-list-category", (req, res, next) => {
  return getListCategory()
    .then((t) => res.status(HttpStatusCode.OK).json(t))
    .catch(next);
});

product.get(
  "/get-list-category-with-paging",
  [pagingParse({ column: "id", dir: "desc" })],
  (req, res, next) => {
    return getCategoryWithPaging(req.query, req.paging)
      .then((t) => res.status(HttpStatusCode.OK).json(t))
      .catch(next);
  }
);

product.post(
  "/new-category",

  [createCategoryValidator],
  (req, res, next) => {
    return createCategory(req.body)
      .then((t) => res.status(HttpStatusCode.OK).json(t))
      .catch(next);
  }
);

product.put(
  "/update-category",

  [updateCategoryValidator],
  (req, res, next) => {
    return updateCategory(req.body)
      .then((t) => res.status(HttpStatusCode.OK).json(t))
      .catch(next);
  }
);

product.delete(
  "/delete-category/:id",

  (req, res, next) => {
    return deleteCategory(req.params.id)
      .then((t) => res.status(HttpStatusCode.OK).json(t))
      .catch(next);
  }
);

product.get("/detail-category/:id", async (req, res, next) => {
  console.log(req.params.id)
  return getDetailCategory(req.params.id)
    .then((t) => res.status(HttpStatusCode.OK).json(t))
    .catch(next);
});

product.put(
  "/change-status-product-category",
  [changeStatusProductValidator],
  (req, res, next) => {
    return changeStatusProductCategory(req.body)
      .then((t) => res.status(HttpStatusCode.OK).json(t))
      .catch(next);
  }
);

export function initWebProductController(app) {
  app.use("/api/product", product);
}
