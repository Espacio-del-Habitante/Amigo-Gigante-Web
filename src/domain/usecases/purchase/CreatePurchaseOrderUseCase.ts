import type { FoundationContact } from "@/domain/models/FoundationContact";
import type { ShopFoundation } from "@/domain/models/ShopFoundation";
import type { IEmailQueueRepository } from "@/domain/repositories/IEmailQueueRepository";
import type { IFoundationRepository } from "@/domain/repositories/IFoundationRepository";

export interface CreatePurchaseOrderItemInput {
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number;
}

export interface CreatePurchaseOrderUseCaseInput {
  orderReference: string;
  userId?: string | null;
  foundationId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string | null;
  buyerAddress?: string | null;
  buyerCity?: string | null;
  buyerCountry?: string | null;
  notes?: string | null;
  shippingCost?: number;
  items: CreatePurchaseOrderItemInput[];
}

export interface OrderSummaryItem {
  productName: string;
  productPrice: number;
  quantity: number;
  subtotal: number;
}

export interface CreatePurchaseOrderUseCaseResult {
  orderReference: string;
  whatsappLink: string | null;
  orderSummary: {
    buyerName: string;
    buyerEmail: string;
    items: OrderSummaryItem[];
    subtotal: number;
    shippingCost: number;
    total: number;
    foundationName: string;
  };
}

const WHATSAPP_BASE = "https://api.whatsapp.com/send/";

function buildWhatsappLink(
  rawUrl: string | null,
  phone: string | null,
  message: string,
): string | null {
  const phoneDigits = resolveWhatsAppPhone(rawUrl, phone);
  if (!phoneDigits || phoneDigits.length === 0) return null;
  const encoded = encodeURIComponent(message);
  return `${WHATSAPP_BASE}?phone=${phoneDigits}&text=${encoded}`;
}

function resolveWhatsAppPhone(rawUrl: string | null, phone: string | null): string | null {
  const trimmed = (rawUrl ?? "").trim();
  if (trimmed.length > 0) {
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      const phoneMatch = /phone=(\d+)/.exec(trimmed);
      if (phoneMatch?.[1]) return phoneMatch[1];
      const waMeMatch = /wa\.me\/(\d+)/.exec(trimmed);
      if (waMeMatch?.[1]) return waMeMatch[1];
    }
    const digits = trimmed.replace(/\D/g, "");
    if (digits.length > 0) return digits;
  }
  const phoneDigits = (phone ?? "").replace(/\D/g, "");
  return phoneDigits.length > 0 ? phoneDigits : null;
}

export class CreatePurchaseOrderUseCase {
  constructor(
    private readonly emailQueueRepository: IEmailQueueRepository,
    private readonly foundationRepository: IFoundationRepository,
  ) {}

  async execute(input: CreatePurchaseOrderUseCaseInput): Promise<CreatePurchaseOrderUseCaseResult> {
    const shippingCost = input.shippingCost ?? 0;
    const orderItems = input.items.map((item) => ({
      productName: item.productName,
      productPrice: item.productPrice,
      quantity: item.quantity,
      subtotal: item.productPrice * item.quantity,
    }));
    const subtotal = orderItems.reduce((sum, i) => sum + i.subtotal, 0);
    const total = subtotal + shippingCost;

    const foundation = await this.foundationRepository.getShopFoundationById(input.foundationId);
    let contact: FoundationContact;
    try {
      contact = await this.foundationRepository.getFoundationContacts(input.foundationId);
    } catch {
      contact = {
        foundationId: input.foundationId,
        foundationName: foundation.name,
        publicEmail: null,
        publicPhone: null,
        instagramUrl: null,
        whatsappUrl: null,
        address: null,
      };
    }

    const payload = this.buildEmailPayload(input, orderItems, subtotal, shippingCost, total, foundation, contact);

    await this.emailQueueRepository.enqueue({
      userId: input.userId ?? null,
      toEmail: input.buyerEmail,
      template: "purchase_voucher",
      payload,
    });
    await this.emailQueueRepository.enqueue({
      userId: input.userId ?? null,
      toEmail: input.buyerEmail,
      template: "purchase_invoice",
      payload,
    });

    const whatsappMessage = this.buildWhatsAppMessage(
      input.orderReference,
      input.buyerName,
      input.buyerEmail,
      input.buyerPhone ?? null,
      input.notes ?? null,
      orderItems,
      subtotal,
      shippingCost,
      total,
      foundation.name,
    );
    const whatsappLink = buildWhatsappLink(
      contact.whatsappUrl,
      contact.publicPhone,
      whatsappMessage,
    );

    return {
      orderReference: input.orderReference,
      whatsappLink,
      orderSummary: {
        buyerName: input.buyerName,
        buyerEmail: input.buyerEmail,
        items: orderItems,
        subtotal,
        shippingCost,
        total,
        foundationName: foundation.name,
      },
    };
  }

  private buildEmailPayload(
    input: CreatePurchaseOrderUseCaseInput,
    orderItems: { productName: string; productPrice: number; quantity: number; subtotal: number }[],
    subtotal: number,
    shippingCost: number,
    total: number,
    foundation: ShopFoundation,
    contact: FoundationContact,
  ): Record<string, unknown> {
    return {
      order: {
        id: input.orderReference,
        buyerName: input.buyerName,
        buyerEmail: input.buyerEmail,
        buyerPhone: input.buyerPhone ?? null,
        buyerAddress: input.buyerAddress ?? null,
        buyerCity: input.buyerCity ?? null,
        buyerCountry: input.buyerCountry ?? null,
        status: "pending",
        subtotal,
        shippingCost,
        total,
        notes: input.notes ?? null,
        createdAt: new Date().toISOString(),
      },
      items: orderItems.map((i) => ({
        productName: i.productName,
        productPrice: i.productPrice,
        quantity: i.quantity,
        subtotal: i.subtotal,
      })),
      foundation: {
        id: foundation.id,
        name: foundation.name,
        city: foundation.city,
        country: foundation.country,
        logoUrl: foundation.logoUrl,
      },
      foundationContact: {
        foundationName: contact.foundationName,
        publicEmail: contact.publicEmail,
        publicPhone: contact.publicPhone,
        whatsappUrl: contact.whatsappUrl,
        address: contact.address,
      },
    };
  }

  private buildWhatsAppMessage(
    orderReference: string,
    buyerName: string,
    buyerEmail: string,
    buyerPhone: string | null,
    notes: string | null,
    orderItems: { productName: string; quantity: number; subtotal: number }[],
    subtotal: number,
    shippingCost: number,
    total: number,
    foundationName: string,
  ): string {
    const now = new Date();
    const dateStr = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    const fmt = (n: number) => Number(n).toLocaleString("es-CO");

    const lines: string[] = [
      "🚀 *Nueva solicitud de compra* 🚀",
      "",
      `📄 *Referencia:* #${orderReference}`,
      `📅 *Fecha:* ${dateStr}`,
      `⏰ *Hora:* ${timeStr}`,
      `👤 *Nombre completo:* ${buyerName}`,
      `📧 *Email:* ${buyerEmail}`,
      ...(buyerPhone ? [`📞 *Teléfono:* ${buyerPhone}`] : []),
      "",
      "🛍️ *Información de la solicitud*",
      "",
      ...orderItems.map(
        (i) => `📦 *${i.productName}* x${i.quantity} — $${fmt(i.subtotal)}`,
      ),
      "",
      `💰 *Subtotal:* $${fmt(subtotal)}`,
      ...(shippingCost > 0 ? [`🚚 *Envío:* $${fmt(shippingCost)}`] : []),
      `💰 *Total:* $${fmt(total)}`,
      ...(notes?.trim() ? ["", `📝 *Observaciones:* ${notes.trim()}`] : []),
      "",
      `_Fundación: ${foundationName}_`,
    ];
    return lines.join("\n");
  }
}
