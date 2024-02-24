const categoryNames = document.getElementById('category')
const brands = document.getElementById('brand')
const warranties = document.getElementById('warranty')
const sellerName = document.getElementById('seller')
const products = document.getElementById('product')
const minPrice = document.getElementById('minPriceInput')
const maxPrice = document.getElementById('maxPriceInput')

// Category Data Fatching 
axios.get('/category/')
    .then((response) => {
        const category = response.data;
        const items = category.map((item, index) => {
            categoryNames.innerHTML += `<div class="form-check" id="category">
                <input class="form-check-input" type="checkbox" value="${item.id}" onclick="productFilter()" id="flexCheckDefault">
                <label class="form-check-label" for="flexCheckDefault">
                    ${item.name}
                </label>
            </div>`;
        });
    })
    .catch((error) => {
        console.error('Error fetching category:', error);
    });


// Brand Data Fatching 
axios.get('/brand/')
    .then((response) => {
        const brand = response.data;
        const items = brand.map((item, index) => {
            brands.innerHTML += `
                <div class="form-check" id="brand">
                    <input class="form-check-input" type="checkbox" value="${item.id}" onclick="productFilter()" id="flexCheckDefault">
                    <label class="form-check-label" for="flexCheckDefault">
                        ${item.name}
                    </label>
                </div>`;
        });
    })
    .catch((error) => {
        console.error('Error fetching brand:', error);
    });


// Warranty Data Fatching 
axios.get('/warranty/')
    .then((response) => {
        const warranty = response.data;
        const items = warranty.map((item, index) => {
            warranties.innerHTML += `<div class="form-check" id="warranty">
                <input class="form-check-input" type="checkbox" value="${item.id}" onclick="productFilter()" id="flexCheckDefault">
                <label class="form-check-label" for="flexCheckDefault">
                    ${item.name}
                </label>
            </div>`;
        });
    })
    .catch((error) => {
        console.error('Error fetching warranty:', error);
    });


// Seller Data Fatching 
axios.get('/seller/')
    .then((response) => {
        const seller = response.data;
        const items = seller.map((item, index) => {
            sellerName.innerHTML += `<div class="form-check" id="seller">
                <input class="form-check-input" type="checkbox" value="${item.id}" onclick="productFilter()" id="flexCheckDefault">
                <label class="form-check-label" for="flexCheckDefault">
                    ${item.name}
                </label>
            </div>`;
        });
    })
    .catch((error) => {
        console.error('Error fetching seller:', error);
    });





// Initial Data Loading
function getSelectedValue() {
    const selectElement = document.querySelector('.form-select');
    const selectedValue = selectElement.value;

    axios.get('/product/')
        .then((response) => {
            const product = response.data;
            if (selectedValue === "1") {
                product.sort((a, b) => a.price - b.price);
            } else if (selectedValue === "2") {
                product.sort((a, b) => b.price - a.price);
            } else {
                product.sort((a, b) => b.id - a.id);
            }
            renderProducts(product);
        })
        .catch((error) => {
            console.error('Error fetching products:', error);
        });

}

axios.get('/product/')
    .then((response) => {
        const product = response.data;
        getSelectedValue();
    })
    .catch((error) => {
        console.error('Error fetching products:', error);
    });

function getAllProducts() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
    });
    getSelectedValue();
}


function renderProducts(product) {

    products.innerHTML = ''
    const items = product.map((item, index) => {
        let offerPriceHTML = '';
        if (item.offer_price) {
            offerPriceHTML = `<h6 h6 class="text-center" style = "color:#708dff" > BDT:${item.offer_price}</h6 > `;
            PriceHTML = `<h6 h6 class="text-decoration-line-through text-center" style = "color:#7E7E7E" > BDT:${item.price}</h6 > `;
        }
        else {
            PriceHTML = `<h6 h6 class="text-center" style = "color:#708dff" > BDT:${item.price}</h6 > `;
        }
        products.innerHTML += `
            <div div class="card col-12 col-md-4" >
                <img src="${item.image}" class="card-img-top" style="height:180px" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${item.name}</h5>
                        <div class="py-2">
                            ${offerPriceHTML}
                            ${PriceHTML}
                        </div>
                        <div class="d-flex justify-content-between gap-2">
                            <a href="#" class="btn btn-sm" style="background-color: #708dff">Buy Now</a>
                            <a href="#" class="btn btn-sm" style="background-color: #565656;color:white">Add to cart</a>
                        </div>
                    </div>
                </div>`
    })
}




// After Data Filtering Product is fetched
function productFilter() {
    products.innerHTML = '';
    // Collect the selected filter values
    const selectedFilters = {
        brand: brands.querySelectorAll('input[type="checkbox"]:checked'),
        category: categoryNames.querySelectorAll('input[type="checkbox"]:checked'),
        warranty: warranties.querySelectorAll('input[type="checkbox"]:checked'),
        seller: sellerName.querySelectorAll('input[type="checkbox"]:checked'),
    };

    // Construct the URL based on the selected filters
    let endpoint = '/product/?';

    for (const filterType in selectedFilters) {
        const filterItems = selectedFilters[filterType];
        if (filterItems.length > 0) {
            const filterValues = Array.from(filterItems).map(item => item.getAttribute('value'));
            endpoint += `${filterType}__in=${filterValues.join(',')}&`;
        }
    }
    
    if (minPrice.value && maxPrice.value) {
        endpoint += `price__gte=${minPrice.value}&price__lte=${maxPrice.value}`;
    }

    // Add sorting option
    const selectElement = document.getElementById('sorting_by_price');
    const selectedValue = selectElement.value;
    
    console.log("Sorting =", selectedValue)

    if (selectedValue === "1") {
        endpoint += '&ordering=price';
    } else if (selectedValue === "2") {
        endpoint += '&ordering=-price';
    }

    console.log("URL =", endpoint)

    axios.get(endpoint)
        .then((response) => {
            const product = response.data;
            const items = product.map((item, index) => {
                let offerPriceHTML = '';
                let PriceHTML = '';
                if (item.offer_price) {
                    offerPriceHTML = `<h6 class="text-center" style="color:#708dff"> BDT:${item.offer_price}</h6>`;
                    PriceHTML = `<h6 class="text-decoration-line-through text-center" style="color:#7E7E7E"> BDT:${item.price}</h6>`;
                } else {
                    PriceHTML = `<h6 class="text-center" style="color:#708dff"> BDT:${item.price}</h6>`;
                }
                products.innerHTML += `
            <div class="card col-12 col-md-4 mb-1 mt-2">
    
                <img src="${item.image}" class="card-img-top " style="height:180px;" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                    <div class="py-2">
                        ${offerPriceHTML}
                        ${PriceHTML}
                    </div>
                    <div class="d-flex justify-content-between gap-2">
                        <a href="#" class="btn btn-sm" style="background-color: #708dff">Buy Now</a>
                        <a href="#" class="btn btn-sm" style="background-color: #565656;color:white">Add to cart</a>
                    </div>
                </div>
            </div>`;
            });
        })
        .catch((error) => {
            console.error('Error fetching products:', error);
        });
}
