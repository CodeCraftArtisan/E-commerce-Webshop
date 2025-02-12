import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cart } from '../../types';
import { API_ENDPOINTS } from '../../constants/api_endpoints';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  private ensureAuthenticated(): boolean {
    if (!this.authService.isUserAuthenticated()) {
      throw new Error('User is not authenticated.');
    }
    return true;
  }

  // Get a cart for the currently authenticated user
  getCart(): Observable<Cart> {
    this.ensureAuthenticated();
    const email = this.authService.getUserEmail();
    if (!email) {
      throw new Error('Authenticated user email not found.');
    }

    return this.http.get<Cart>(API_ENDPOINTS.carts.getByUserEmail(email));
  }

  // Add an item to the cart
  addItemToCart(productId: string, quantity: number): Observable<Cart> {
    this.ensureAuthenticated();
    const email = this.authService.getUserEmail();
    if (!email) {
      throw new Error('Authenticated user email not found.');
    }

    const body = { productId, quantity };
    return this.http.post<Cart>(API_ENDPOINTS.carts.addItem(email), body);
  }

  // Remove an item from the cart
  removeItemFromCart(productId: string): Observable<Cart> {
    this.ensureAuthenticated();
    const email = this.authService.getUserEmail();
    if (!email) {
      throw new Error('Authenticated user email not found.');
    }

    return this.http.delete<Cart>(
      API_ENDPOINTS.carts.removeItem(email, productId)
    );
  }

  // Clear the entire cart for the authenticated user
  clearCart(): Observable<void> {
    this.ensureAuthenticated();
    const email = this.authService.getUserEmail();
    if (!email) {
      throw new Error('Authenticated user email not found.');
    }

    return this.http.delete<void>(API_ENDPOINTS.carts.clearCart(email));
  }
}
