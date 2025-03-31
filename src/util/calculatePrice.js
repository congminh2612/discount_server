// src/utils/calculatePrice.js
import { Product, Variant, User, CustomPricing } from '../models/index.js';

export const calculatePrice = async (userId, productId, variantId = null, transaction = null) => {
  let product, variant, originalPrice, finalPrice;
  let appliedRule = null;

  if (variantId) {
    variant = await Variant.findByPk(variantId, { transaction });
    if (!variant) throw new Error('Variant not found');

    originalPrice = parseFloat(variant.original_price);
    finalPrice = parseFloat(variant.final_price);

    const pricingRules = await CustomPricing.findAll({
      include: [
        {
          model: User,
          as: 'customers',
          where: { id: userId },
          required: false,
        },
        {
          model: Variant,
          as: 'variants',
          where: { id: variantId },
          required: false,
          through: { attributes: ['amount'] },
        },
      ],
      transaction,
    });

    for (const rule of pricingRules) {
      if (rule.is_price_list) {
        const match = rule.variants.find(v => v.id === variantId);
        const priceFromAmount = match?.CustomPricingVariant?.amount;
        if (priceFromAmount) {
          finalPrice = parseFloat(priceFromAmount);
          appliedRule = rule;
          break;
        }
      }
    }

    if (!appliedRule) {
      let maxDiscount = 0;
      for (const rule of pricingRules) {
        if (!rule.is_price_list && rule.variants.some(v => v.id === variantId)) {
          let discount = 0;
          if (rule.discount_type === 'percentage') {
            discount = (rule.discount_value / 100) * originalPrice;
          } else if (rule.discount_type === 'fixed') {
            discount = rule.discount_value;
          }
          if (discount > maxDiscount) {
            maxDiscount = discount;
            appliedRule = rule;
          }
        }
      }
      if (maxDiscount > 0) {
        finalPrice = Math.max(originalPrice - maxDiscount, 0);
      }
    }

  } else {
    product = await Product.findByPk(productId, { transaction });
    if (!product) throw new Error('Product not found');

    originalPrice = parseFloat(product.original_price);
    finalPrice = parseFloat(product.final_price);

    const pricingRules = await CustomPricing.findAll({
      include: [
        {
          model: User,
          as: 'customers',
          where: { id: userId },
          required: false,
        },
        {
          model: Product,
          as: 'products',
          where: { id: productId },
          required: false,
          through: { attributes: ['amount'] },
        },
      ],
      transaction,
    });

    for (const rule of pricingRules) {
      if (rule.is_price_list) {
        const match = rule.products.find(p => p.id === productId);
        const priceFromAmount = match?.CustomPricingProduct?.amount;
        if (priceFromAmount) {
          finalPrice = parseFloat(priceFromAmount);
          appliedRule = rule;
          break;
        }
      }
    }

    if (!appliedRule) {
      let maxDiscount = 0;
      for (const rule of pricingRules) {
        if (!rule.is_price_list && rule.products.some(p => p.id === productId)) {
          let discount = 0;
          if (rule.discount_type === 'percentage') {
            discount = (rule.discount_value / 100) * originalPrice;
          } else if (rule.discount_type === 'fixed') {
            discount = rule.discount_value;
          }
          if (discount > maxDiscount) {
            maxDiscount = discount;
            appliedRule = rule;
          }
        }
      }
      if (maxDiscount > 0) {
        finalPrice = Math.max(originalPrice - maxDiscount, 0);
      }
    }
  }

  return {
    originalPrice,
    finalPrice,
    discountAmount: originalPrice - finalPrice,
    appliedRule,
  };
};
