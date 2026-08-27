const products=[
{id:1,name:"Sunflower Oil",price:160,emoji:"🌻",size:"1 Litre"},
{id:2,name:"Mustard Oil",price:180,emoji:"🫙",size:"1 Litre"},
{id:3,name:"Groundnut Oil",price:200,emoji:"🥜",size:"1 Litre"},
{id:4,name:"Rice Bran Oil",price:220,emoji:"🌾",size:"1 Litre"},
{id:5,name:"Coconut Oil",price:240,emoji:"🥥",size:"1 Litre"},
{id:6,name:"Olive Oil",price:450,emoji:"🫒",size:"500 ml"},
{id:7,name:"Sesame Oil",price:280,emoji:"🌰",size:"1 Litre"},
{id:8,name:"Almond Oil",price:520,emoji:"🌰",size:"500 ml"}
];
let cart={};

const $=id=>document.getElementById(id);
function money(n){return "₹"+n.toLocaleString("en-IN")}
function renderProducts(list=products){
  $("productsGrid").innerHTML=list.map(p=>`
  <article class="product">
    <div class="product-img">${p.emoji}</div>
    <h3>${p.name}</h3><div class="size">${p.size}</div>
    <div class="price">${money(p.price)}</div>
    <div class="product-actions">
      <div class="qty"><button onclick="quickQty(${p.id},-1)">−</button><span id="q-${p.id}">1</span><button onclick="quickQty(${p.id},1)">+</button></div>
      <button class="add" onclick="addToCart(${p.id}, Number(document.getElementById('q-${p.id}').textContent))">🛒 Add to Cart</button>
    </div>
  </article>`).join("");
}
function quickQty(id,d){
  const el=$("q-"+id); el.textContent=Math.max(1,Number(el.textContent)+d);
}
function addToCart(id,qty=1){
  cart[id]=(cart[id]||0)+qty; renderCart(); toast("Added to cart ✓");
}
function changeCart(id,d){
  cart[id]=(cart[id]||0)+d;if(cart[id]<=0)delete cart[id];renderCart();
}
function renderCart(){
  const ids=Object.keys(cart).map(Number);
  $("cartItems").innerHTML=ids.length?ids.map(id=>{
    const p=products.find(x=>x.id===id), q=cart[id];
    return `<div class="cart-item"><div class="thumb">${p.emoji}</div><div><h4>${p.name}</h4><small>${p.size} · ${money(p.price)}</small>
    <div class="cart-controls"><button onclick="changeCart(${id},-1)">−</button><b>${q}</b><button onclick="changeCart(${id},1)">+</button></div></div>
    <div><b>${money(p.price*q)}</b><br><button class="remove" onclick="delete cart[${id}];renderCart()">🗑️</button></div></div>`;
  }).join(""):`<div style="text-align:center;padding:60px 10px;color:#758078">Your cart is empty 🛒</div>`;
  const count=ids.reduce((s,id)=>s+cart[id],0), subtotal=ids.reduce((s,id)=>s+products.find(p=>p.id===id).price*cart[id],0);
  const delivery=subtotal===0?0:(subtotal>=499?0:40);
  $("cartCount").textContent=count;$("cartTotal").textContent=money(subtotal);
  $("subtotal").textContent=money(subtotal);$("delivery").textContent=delivery?money(delivery):"FREE";$("grandTotal").textContent=money(subtotal+delivery);
}
function toast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800)}
function openCart(){$("cartPanel").classList.add("open");$("overlay").classList.add("open")}
function closeCart(){$("cartPanel").classList.remove("open");$("overlay").classList.remove("open")}
$("cartBtn").onclick=openCart;$("closeCart").onclick=closeCart;$("overlay").onclick=closeCart;$("continueShopping").onclick=closeCart;
$("searchBtn").onclick=()=>{ $("search").focus();document.querySelector("#products").scrollIntoView({behavior:"smooth"}) };
$("search").oninput=e=>{const q=e.target.value.toLowerCase();renderProducts(products.filter(p=>p.name.toLowerCase().includes(q)))};
$("couponBtn").onclick=()=>{const c=$("coupon").value.trim().toUpperCase();toast(c==="OIL10"?"Coupon applied! (demo)":"Invalid coupon (try OIL10)")};
$("checkout").onclick=()=>toast(Object.keys(cart).length?"Checkout is a demo — no real payment is processed.":"Your cart is empty");
renderProducts();renderCart();
