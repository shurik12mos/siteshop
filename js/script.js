jQuery(document).ready(function () {

    "use strict";

    var store = {
        vpa_121: {
            name: 'Контролер VPA-121',
            page: 'vpa_121.html',
            price: 1620
        },
        vpa_321: {
            name: 'Контролер VPA-321',
            page: 'vpa_321.html',
            price: 2480
        },
        pos_101: {
            name: 'WiFi розетка POS-101',
            page: 'pos_101.html',
            price: 640
        },
        brk_101: {
            name: 'WiFi вимикач BRK-101',
            page: 'brk_101.html',
            price: 670
        },
        swa_111: {
            name: 'WiFi реле SWA-111',
            page: 'swa_111.html',
            price: 860
        },
        bas_101: {
            name: 'WiFi реле BAS-101',
            page: 'bas_101.html',
            price: 310
        },
        vpa_320: {
            name: 'Контролер VPA-320',
            page: 'vpa_320.html',
            price: 1940
        },
        uhr_101: {
            name: 'Регулятор теплої підлоги UHR-101',
            page: 'uhr_101.html',
            price: 1940
        }
    }

    $(".popup-client > span").on("click", function () {
        $(".account-popup-sec").addClass("active");
        $("html").addClass("no-scroll");
    });

    $(".close-popup").on("click", function () {
        $(".account-popup-sec").removeClass("active");
        $("html").removeClass("no-scroll");
    });

    $('.menu-toggle').on("click", function () {
        $(".menu nav").slideToggle();
    });

    // Get Header Height //
    var stick = $(".simple-header.for-sticky").height();
    $(".simple-header.for-sticky").parent().css({
        "padding-top": stick
    });


    $("header").on("click", function (e) {
        e.stopPropagation();
    });
    $(".menu-item-has-children > a").on("click", function () {
        $(this).parent().siblings().children("ul").slideUp();
        $(this).parent().siblings().removeClass("active");
        $(this).parent().children("ul").slideToggle();
        $(this).parent().toggleClass("active");
        return false;
    });


    /*** FIXED Menu APPEARS ON SCROLL DOWN ***/
    $(window).scroll(function () {
        var scroll = $(window).scrollTop();
        if (scroll >= 50) {
            $(".for-sticky").addClass("sticky");
        }
        else {
            $(".for-sticky").removeClass("sticky");
            $("for-sticky").addClass("");
        }
    });


    /*=================== Parallax ===================*/
    $('.parallax').scrolly({bgParallax: true});


    /*
        Init cart
     */

    var cartCount = 0;
    var cartProducts = {};
    (function () {
        var storage = localStorage.getItem('cart');

        if (storage) {
            try {
                cartProducts = JSON.parse(storage);
            } catch (e) {
                cartProducts = {};
                return;
            }
        } else {
            cartProducts = {};
        }

        for (var key in cartProducts) {
            if (cartProducts.hasOwnProperty(key)) {
                cartCount += cartProducts[key].number;
            }
        }

        updateCartCount(cartCount)
    })();
    /*
    Add to cart
     */

    $(document).on('click', '.add-to-cart', function (e) {
        e.preventDefault();

        var item = $(e.currentTarget);
        var itemId = item.data('itemid');

        if (!itemId) {
            addNotification('Помилка додавання до корзини');
            return;
        }

        var storeItem = store[itemId];

        if (!storeItem) {
            addNotification('Помилка додавання до корзини');
            return;
        }

        var storage = localStorage.getItem('cart');

        if (storage) {
            try {
                storage = JSON.parse(storage);
            } catch (e) {
                storage = {};
            }
        } else {
            storage = {};
        }

        storage[itemId] = {
            item: storeItem,
            number: storage[itemId] && storage[itemId].number ? storage[itemId].number + 1 : 1
        };

        try {
            storage = JSON.stringify(storage);
        } catch (e) {
            addNotification('Помилка додавання до корзини');
            return;
        }

        localStorage.setItem('cart', storage);

        itemAddedToCart();
    });

    function addNotification(notification) {
        console.log(notification);

        var notBlock = $('.notifications');

        if (!notBlock || !notBlock.length) {
            $('body').append("<div class='notifications'></div>");
        }
        var html = "<div>" + notification + "</div>"

        $('.notifications').append(html);
        setTimeout(function(){
            $('.notifications>div').eq(0).remove();
        }, 10000);
    }

    function itemAddedToCart() {
        cartCount++;
        saveCartCount(cartCount);
        updateCartCount(cartCount);
        animateCart();
    }

    function animateCart() {
        $('nav ul li .badge').removeClass('pulse');

        setTimeout(function () {
            $('nav ul li .badge').addClass('pulse');
        }, 50);
    }

    function itemRemovedFromCart() {
        cartCount--;
        saveCartCount(cartCount);
        updateCartCount(cartCount);
        animateCart();
    }

    function saveCartCount(number) {
        localStorage.setItem('cartCount', number);
    }

    function updateCartCount(number) {
        $('nav ul li .badge').text(number);
    }


    /*
    Cart page
     */

    (updateCartHtml)();

    function updateCartHtml() {
        var cart = $('.cart-total-box');

        if (!cart) return;

        if (!Object.keys(cartProducts).length) {
            calculateCart(0);
            return;
        }

        var htmlItems = '';
        var total = 0;

        for (var key in cartProducts) {
            if (!cartProducts.hasOwnProperty(key)) return;

            var product = cartProducts[key];

            total += product.item.price * product.number;

            //cart-items-list
            htmlItems += "<li class='cart-item' data-itemid='" + key + "'>";
            htmlItems += "<div class='minus'>-</div>";
            htmlItems += "<h3>" + product.item.name + " × " + product.number + "</h3>";
            htmlItems += "<div class='plus'>+</div>";
            htmlItems += " <span>" + product.item.price * product.number + "</span></li>";
        }

        $('.cart-total-box .cart-item').remove();

        $('.cart-total-box .cart-items-list').prepend(htmlItems);

        calculateCart(total);
    }

    function calculateCart(total) {
        var delivery = 80;
        $('.cart-first-summary span').text(total);
        $('.cart-delivery-price span').text(delivery);
        $('.cart-total span').text(delivery + total);
    }

    $(document).on('click', '.cart-item .minus', function (e) {
        var id = $(e.target).closest('.cart-item').data('itemid');
        updateCart(id, false);
    })

    $(document).on('click', '.cart-item .plus', function (e) {
        var id = $(e.target).closest('.cart-item').data('itemid');
        updateCart(id, true);
    })

    function updateCart(id, plus) {
        if (!cartProducts[id]) {
            addNotification('Not valid product');
            return;
        }

        if (plus) {
            cartProducts[id].number++;
            itemAddedToCart();
        } else {
            cartProducts[id].number--;
            itemRemovedFromCart();
            if (cartProducts[id].number < 1) {
                delete cartProducts[id];
            }
        }

        updateCartHtml();
        localStorage.setItem('cart', JSON.stringify(cartProducts));

    }

    $('.submit-cart').on('click', function () {
        var firstName = $('input[name="firstName"]').val();
        var lastName = $('input[name="lastName"]').val();
        var email = $('input[name="email"]').val();
        var city = $('input[name="city"]').val();
        var phone = $('input[name="phone"]').val();
        var addressLine1 = $('input[name="addressLine1"]').val();
        var addressLine2 = $('input[name="addressLine2"]').val();
        var order = cartProducts;

        if (!firstName) {
            addNotification("Заповніть Ваше ім'я, будь ласка");
            return;
        }

        if (!lastName) {
            addNotification("Заповніть Ваше прізвище, будь ласка");
            return;
        }

        if (!city) {
            addNotification("Заповніть Ваше місто, будь ласка");
            return;
        }
        if (!phone || !phone.replace(/\D/, "").match(/^\d{10,12}$/)) {
            addNotification("Введіть коректний телефон, будь ласка");
            return;
        }
        if (!addressLine1 || !addressLine2) {
            addNotification("Заповніть Вашу адресу, будь ласка");
            return;
        }

        if (!email || !email.match(/^[\d\w+.]*@\w*\.\w*$/)) {
            addNotification("Введіть коректний email, будь ласка");
            return;
        }

        $.post('order.php',
            {
                order: order,
                first_name: firstName,
                last_name: lastName,
                city: city,
                phone: phone,
                address_line1: addressLine1,
                address_line2: addressLine2
            },
            function(data){
                if (data.success) {
                    addNotification("Ваше замовлення в обробці.")
                    cartProducts = {};
                    cartCount = 0;
                    localStorage.removeItem('cart');
                    updateCartHtml();
                    return;
                }


            }
        ).fail(function() {
            addNotification("Сталася помилкаю Спробуйте ще раз");
        })


    })

});