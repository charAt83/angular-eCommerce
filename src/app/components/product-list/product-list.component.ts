import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartItem } from '../../common/cart-item';
import { Product } from '../../common/product';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, NgbModule, RouterModule],
  templateUrl: './product-list-grid.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent {
  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: string = '';
  searchMode: boolean = false;

  page: number = 1; // Two way binding from backend to angular and vice-versa. The bindings are defined in product-list-grid.component.html file.
  pageSize: number = 5; // One way binding. From backend to angular
  totalElements: number = 0; //One way binding. From backend to angular
  previousKeyword: string = '';

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyWord');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    const keyWord = this.route.snapshot.paramMap.get('keyWord');

    if (this.previousKeyword != keyWord) {
      this.page = 1;
    }
    this.previousKeyword = keyWord ?? ' ';
    this.productService
      .getSearchPaginate(this.page - 1, this.pageSize, keyWord ?? '')
      .subscribe(this.processResult());
  }

  handleListProducts() {
    if (this.route.snapshot.paramMap.has('id')) {
      this.currentCategoryId = +(this.route.snapshot.paramMap.get('id') ?? 1);
      this.currentCategoryName =
        this.route.snapshot.paramMap.get('name') ?? 'Books';
    } else {
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books';
    }

    // Check if we have different category than previous.

    //if different category id is present, set the page number to 1.

    if (this.previousCategoryId != this.currentCategoryId) {
      this.page = 1;
    }
    this.previousCategoryId = this.currentCategoryId;
    console.log(
      `Previous category id = ${this.previousCategoryId} Page Number is ${this.page}`
    );

    //Get the products for the given category id and given pagination status.
    // By default, the backend gives page 1 information. if the user click on page 2, then the page parameter is updated and was sent to backend.
    // Then, backend gives the info for given page. Thats how the two way binding works.
    this.productService
      .getProductListPaginate(
        this.page - 1,
        this.pageSize,
        this.currentCategoryId
      )
      .subscribe(this.processResult());
  }

  updatePageSize(pageSize: string) {
    this.pageSize = +pageSize;
    this.page = 1;
    this.listProducts();
  }

  private processResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.page = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    };
  }

  addToCart(product: Product) {
    
    const cartItem = new CartItem(product);

    this.cartService.addToCart(cartItem);
        
  }
}
