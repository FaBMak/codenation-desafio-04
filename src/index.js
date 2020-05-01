const promotions = ['SINGLE LOOK', 'DOUBLE LOOK', 'TRIPLE LOOK', 'FULL LOOK'];

// Desestruturação do JSON (Objeto), buscando o Array produtos e renomeando para productsList
// const { products: productsList } = require('../src/data/products');

// Reduce somando os preços
function somaPrices (prices) {
	const somaprices = prices.reduce((resultado, price) => {
		return (resultado + price);
	}, 0);
	return somaprices;
};

// getShoppingCart recebe dois arrays productsIds e productsList
// productsIds é o array de Ids dos produtos que serão adicionados ao carrinho
// productsList é o array com os produtos da loja
function getShoppingCart(productsIds, productsList) {
	
	// Aqui uso o método map para percorrer o array de Ids
	// Para interação do map, faço um filter nos produtos da loja, comparando o Id atual com o Id do produto
	// Isso retorna um array com todos os dados dos produtos selecionados
	// const productsCartList = productsIds.map(productId => productsList.filter(product => product.id === productId));
	// Trocado para o método abaixo, usando push, pois o método acima, retornava um array de arrays
	const productsCartList = [];
	productsIds.map((productId) => {
		productsList.filter((product) => {			
			if (product.id === productId) {
				productsCartList.push(product);
			}
		})
	});

	// Para calcular o desconto, devemos saber quantos tipos de peças diferentes está no carrinho
	// Para isso, usamos um array. Assim, a partir da consulta da categoria dos produtos.
	// Verificamos se a categoria já existe no array e caso não exista a insere no mesmo
	// Assim, basta consultar o tamanho do array pra saber o tipo de promoção  
	const productsCartCategories = [];
	productsCartList.forEach(product => {
		if (!productsCartCategories.includes(product.category))
			productsCartCategories.push(product.category);
	});
	
	// Cria um array para formatar o retorno com nome e categoria
	const productsDetails = [];
	productsCartList.forEach(product => {
		productsDetails.push({ name: product.name, category: product.category });
	});

	// Pega o tipo de promoção
	let cartPromotion = promotions[productsCartCategories.length - 1];

	// Obtem os precos normais do produtos
	const regularsPrices = productsCartList.map(product => product.regularPrice);

	// Percorre o carrinho pegando os produtos
	// Depois pra cada produto, pega as promoções
	const promotionsPrices = [];
	productsCartList.forEach((product,index) => {
		const promotions = product.promotions;
		const regularPrice = product.regularPrice;
		promotions.forEach(promotion => {
			// Se encontrou a promoção insere no array de promotionsPrices
			if(promotion.looks.includes(cartPromotion))
				promotionsPrices.push(promotion.price);
		});
		// Se para aquele produto, não foi encontrado o preço promocional
		// Insere o valor regularPrice no promotionsPrices
		if (!promotionsPrices[index])
			promotionsPrices.push(regularPrice);
	});


	const regularPrice = somaPrices(regularsPrices);
	const promotionalPrice = somaPrices(promotionsPrices);

	const discountValue = regularPrice - promotionalPrice;
	const discountPercentage = (100 - ((promotionalPrice / regularPrice)*100)).toFixed(2);

	return {
		products: productsDetails,
		promotion: cartPromotion,
		totalPrice: promotionalPrice.toFixed(2),
		discountValue: discountValue.toFixed(2),
		discount: `${discountPercentage}%`
	};
}

module.exports = { getShoppingCart };
