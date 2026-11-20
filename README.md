# CartLab — cart / money demo

A modern checkout with deliberately broken cart arithmetic. Self-contained: push this folder as its own GitHub repo.

## Run locally

```bash
cp config.example.js config.js   # set window.BUGSHIELD_KEY
# or use the root repo: npm run demo  ->  http://localhost:5173/cart-lab
```

## Deploy

Render **Static Site** using the included `render.yaml`; set `BUGSHIELD_KEY`. Build script writes `config.js` and `version.json`.

## Planted bugs

1. Adding an item twice makes quantity **11** (string concatenation).
2. Coupon `SAVE10` applies the discount **twice**.
3. Shipping is always free even below the stated $25 threshold.
4. Tax is computed on the **pre-discount** subtotal.
5. Discount is subtracted **after** tax.
6. Coupon check is case-sensitive (`save10` fails).
7. Checkout confirmation uses **€** instead of `$`.
8. Cart is never cleared after placing an order.

## Demo value

Money identifiers in the diff always trigger the **human approval gate** — with the documented conservative false-positive story. Perfect for showing that a fix is staged, reviewed and only then deployed.

Suggested report: *"Adding the same item twice makes the quantity 11 and the total uses a euro sign."*
