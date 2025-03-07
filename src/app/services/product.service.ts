import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = `${environment.backendURL}/products`;
  private categoryURL = `${environment.backendURL}/product-category`;

  constructor(private httpClient: HttpClient) {}

  getProductList(_currentCategoryId: number): Observable<Product[]> {
    // Need to build URL based on category Id.
    const searchURL = `${this.baseUrl}/search/findByCategoryId?id=${_currentCategoryId}`;
    console.log(searchURL);
    
    return this.getProducts(searchURL);
  }

  // What this method do is get the data from the backend and pass it to the product-list-component.ts file.
  // All the parameters page pageSize and category id comes from product-list-component file. 
  
  getProductListPaginate(
    page: number,
    pageSize: number,
    _currentCategoryId: number
  ): Observable<GetResponseProducts> {
    const searchURL = `${this.baseUrl}/search/findByCategoryId?id=${_currentCategoryId}&page=${page}&size=${pageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchURL);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient
      .get<GetResponseProductCategory>(this.categoryURL)
      .pipe(map((response) => response._embedded.productCategory));
  }

  getSearch(keyWord: string): Observable<Product[]> {
    const searchURL = `${this.baseUrl}/search/findByNameContaining?name=${keyWord}`;
    return this.getProducts(searchURL);
  }

  private getProducts(searchURL: string): Observable<Product[]> {
    return this.httpClient
      .get<GetResponseProducts>(searchURL)
      .pipe(map((response) => response._embedded.products));
  }

  getProductId(productId: number): Observable<Product> {
    const productDetailsURL = `${this.baseUrl}/${productId}`;
    return this.httpClient.get<Product>(productDetailsURL);
  }


  getSearchPaginate(page:number, pageSize:number, keyWord: string): Observable<GetResponseProducts> {
    const searchURL = `${this.baseUrl}/search/findByNameContaining?name=${keyWord}&page=${page}&size=${pageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchURL);
  }
}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  };

  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  };
}
