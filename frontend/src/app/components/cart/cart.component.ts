import { Component, OnInit } from '@angular/core';
import { CartService } from '../shop/services/cart.service';
import { Cart, CartItems } from '../../components/types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;
  total: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  // Fetch the authenticated user's cart
  loadCart(): void {
    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cart = cart;
        this.calculateTotal();
      },
      error: (err) => {
        console.error('Error loading cart:', err);
        this.cart = null; // Reset cart on failure
      },
    });
  }

  // Update quantity of an item
  updateQuantity(item: CartItems, newQuantity: number): void {
    if (newQuantity <= 0) return;

    this.cartService.addItemToCart(item.productId, newQuantity).subscribe({
      next: () => {
        this.loadCart();
      },
      error: (err) => {
        console.error('Error updating quantity:', err);
      },
    });
  }

  // Remove an item from the cart
  removeItem(item: CartItems): void {
    this.cartService.removeItemFromCart(item.productId).subscribe({
      next: () => {
        this.loadCart();
      },
      error: (err) => {
        console.error('Error removing item:', err);
      },
    });
  }

  // Calculate total price
  calculateTotal(): void {
    this.total =
      this.cart?.items?.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      ) || 0;
  }
}
