import React from "react";
import ContentStorage from './ContentStorage.js';
import "./App.css";

function ProductCard(props) {
	return (
		<article className="productCard col-xs-12 col-sm-6 col-md-6 col-lg-4 col-xl-3">
			<h1>{props.product.header}</h1>
			<p>{props.product.content}</p>
			<div className="row">
				<money className="col">{props.product.price}<currency>$</currency></money>
				<button
					className="col btn-accessable"
					onClick={props.addProductToBasket}
				>В корзину</button>
			</div>
		</article>
	);
}



class ProductList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		};
	}

	render() {
		const productList = this.props.products.map(
			prod =>
				<ProductCard
					product={prod}
					addProductToBasket={() => this.props.addProductToBasket(prod)}
				/>
		);

		return (
			<div className="col-xm-12 col-sm-12 col-md-12 col-lg-10 col-xl-01">
				<div className="row">
					{productList}
				</div>
			</div>
		);
	}
}



function BacketElem(props) {
	return (
		<article>
			<b>{props.elem.header}</b>
			<div className="row">
				<money className="col">{props.elem.price}<currency>$</currency></money>
				<button
					className="btn-accessable col"
					onClick={props.removeProductFromBasket}
				>Удалить</button>
			</div>
		</article>
	);
}



class ShoppingBacket extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		};
	}

	render() {
		const res = this.props.basket.map(
			prod => <BacketElem
				elem={prod}
				removeProductFromBasket={() => this.props.removeProductFromBasket(prod)}
			/>
		);

		return (
			<div className="col-xm-12 col-sm-12 col-md-12 col-lg-2 col-xl-2">
				<div className="row">
					<b className="col-xm-6 col-sm-6 col-md-6 col-lg-12 col-xl-6">Корзина</b>
					<button className="btn-accessable col-xm-6 col-sm-6 col-md-6 col-lg-12 col-xl-6">Заказать</button>
				</div>
				<div>
					{res}
				</div>
			</div>
		);
	}
}

class Search extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		};
	}

	render() {
		return (
			<div className="row">
				<label className="col-2" for="search-input">Поиск:</label>
				<input id="search-input" type="text" className="srch-accessable col-8" />
				<button
					className="btn-accessable col-2"
					onClick={
						() => {
							let accessableSearchs = document.getElementById("search-input");
							return this.props.filter(accessableSearchs.value);
						}
					}
				>
					Искать
				</button>
			</div>
		);
	}
}

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			filter: "",
			basket: [

			],
			isAlreadyRestored: false,
			contentStore: new ContentStorage("backet"),
			shop: [
				{
					img: "",
					header: "Товар-1",
					content: "Тип1",
					price: 101,
				},
				{
					img: "",
					header: "Товар-2",
					content: "Тип1",
					price: 102,
				},
				{
					img: "",
					header: "Товар-3",
					content: "Тип5",
					price: 102,
				},
				{
					img: "",
					header: "Товар-17",
					content: "Тип4",
					price: 103,
				},
				{
					img: "",
					header: "Товар-6",
					content: "Тип1",
					price: 104,
				},
				{
					img: "",
					header: "Товар-8",
					content: "Тип4",
					price: 105,
				},
			],
		};

		this.state.contentStore.init();
		this.restoreBasket();

	}

	restoreBasket() {
		if (!this.state.isAlreadyRestored) {
			this.state.contentStore.getItems(
				(restoredBasket) => {
					this.addProductsToBasketWhenInitBacket(restoredBasket);
				});
			this.setState({ isAlreadyRestored: true });
		}
	}

	addProductsToBasketWhenInitBacket(products) {
		const basket = this.state.basket;
		for (let i in products) {
			basket.push(products[i]);
		}
		this.setState({ basket: basket });

		this.state.contentStore.setItems(basket);
	}

	addProductToBasket(product) {
		const basket = this.state.basket;
		basket.push(product);
		this.setState({ basket: basket });
		
		this.state.contentStore.setItems(basket);
	}

	removeProductFromBasket(product) {
		const basket = this.state.basket;
		basket.splice(basket.indexOf(product), 1);
		this.setState({ basket: basket })

		this.state.contentStore.setItems(basket);
	}

	getProducts() {
		if (this.state.filter.length < 1) {
			return this.state.shop;
		} else {
			const result = [];
			for (let i in this.state.shop) {
				for (let j in this.state.shop[i]) {
					if (!this.state.shop[i][j].indexOf) {
						continue;
					} else if (this.state.shop[i][j].indexOf(this.state.filter) > -1) {
						result.push(this.state.shop[i]);
						break;
					}
				}
			}
			return result;
		}
	}

	setFilter(newFilter) {
		this.setState({ filter: newFilter });
	}

	getBasket() {
		return this.state.basket;
	}

	render() {
		return (
			<main className="appWrapper container">
				<Search
					filter={(newFilter) => this.setFilter(newFilter)}
				/>
				<div className="row">
					<ShoppingBacket
						basket={this.getBasket()}
						removeProductFromBasket={this.removeProductFromBasket.bind(this)}
					/>
					<ProductList
						products={this.getProducts()}
						addProductToBasket={this.addProductToBasket.bind(this)}
					/>
				</div>
			</main>
		);
	}
}

export default App;
