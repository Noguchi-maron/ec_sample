window.onload = function () {
  var cart_btns = document.querySelectorAll('.js_cart_btn'),//カートボタン
  cart_cnt_icon = document.getElementById('js_cart_cnt'),//カートの個数アイコン
  cart_cnt = 0,//カートのアイテム数
  clicked = [],//クリックされたカートアイコンのインデックス
  save_items = [],//ローカルストレージ保存用の配列
  items = JSON.parse(localStorage.getItem("items")),//ローカルストレージの商品データ配列
  searchWin = document.querySelector('#search input'),//検索窓
  itemLists = document.querySelectorAll('li.item'),//一つのitemの塊
  sortForm = document.querySelector('#sort'),
  sortRadios = document.querySelectorAll('#sort label input'),
  sortLabels = document.querySelectorAll('#sort label'),
  itemContents = [
    {
      name: "ズボン",
      price: 3000,
      kana: "ずぼん",
      img: "img/denim.png"
    },
    {
      name: "ジョウロ",
      price: 2000,
      kana: "じょうろ",
      img: "img/funnel.png"
    },
    {
      name: "メガネ",
      price: 20000,
      kana: "めがね",
      img: "img/glasses.png"
    },
    {
      name: "風景画",
      price: 500000,
      kana: "ふうけいが",
      img: "img/painting.png"
    },
    {
      name: "ワイン",
      price: 40000,
      kana: "わいん",
      img: "img/wine.png"
    },
    {
      name: "ホールケーキ",
      price: 3000,
      kana: "ほーるけーき",
      img: "img/cake.png"
    },
    {
      name: "ダイアモンド",
      price: 10000000,
      kana: "だいあもんど",
      img: "img/diamond.png"
    },
    {
      name: "自転車",
      price: 30000,
      kana: "じてんしゃ",
      img: "img/bicycle.png"
    },
    {
      name: "食パン",
      price: 150,
      kana: "しょくぱん",
      img: "img/bread.png"
    },
    {
      name: "ダンベル",
      price: 1000,
      kana: "だんべる",
      img: "img/dumbbell.png"
    },
  ],
  itemTitles = document.querySelectorAll('.item_title h2'),//itemの名前を入れるh2
  priceTags = document.querySelectorAll('.js_get_price'),
  imgTag = document.querySelectorAll('.item_img img');

  itemTitles.forEach((title, index)=> {
    title.textContent = itemContents[index].name;
  });
  priceTags.forEach((price, index) => {
    price.textContent = itemContents[index].price;
  });
  imgTag.forEach((img, index) => {
    img.src = itemContents[index].img;

  });

  // すでにカートに商品が入っている場合、カートアイコンのカウント表示とカートボタンをアクティブにする
  if (items) {
    var id;
    for (var i = 0; i < items.length; i++) {
      id = items[i].id;
      save_items.push(items[i]);
      clicked.push(id);
      activate_btn(id);
    }

    if(items.length != 0){
      cart_cnt_icon.parentNode.classList.remove('hidden');
      cart_cnt_icon.innerHTML = cart_cnt;
    }
  }


//ひらがなの配列作成
  let kanaArray = [];
  itemContents.forEach(item => {
    kanaArray.push(item.kana);
  });

//検索機能
  searchWin.addEventListener('keyup', () => {
    const searchTxt = searchWin.value;
    itemLists.forEach(item => {
      item.classList.remove('hidden');
    });
    
    //検索が有効ではない場合は以下の処理を行わない
    if (
      kanaArray.findIndex(kana => kana[0] === searchTxt[0]) === -1
    ) {
      return;
    }

    let targetArray = kanaArray.filter(kana => kana.indexOf(searchTxt) === -1);
    if (targetArray.length === kanaArray.length) {
      return;
    }
    let targetIndex = [];
    targetArray.forEach(kana => {
      let index = kanaArray.indexOf(kana);
      targetIndex.push(index);
    });

    targetIndex.forEach(i => {
      itemLists[i].classList.add('hidden');
    });
  });

  const jpnAlp = document.querySelector('#jpnAlp');
  const heigher = document.querySelector('#heigher');
  const lower = document.querySelector('#lower');
  const priceArray = [];
  itemContents.forEach(item => {
    priceArray.push(item.price)
  });

  console.log(priceArray);
  //ソート機能

  sortForm.addEventListener('click', () => {
    sortLabels.forEach((label, i) => {
      label.classList.remove('selected');
      if(sortRadios[i].checked) {
        label.classList.add('selected');
    }
    });
    if (sortRadios[0].checked) {
      itemContents.sort((a, b) => a.kana.localeCompare(b.kana, 'ja'));
    } else if (sortRadios[1].checked) {
      itemContents.sort((a, b) => a.price - b.price);
      itemContents.reverse();
    } else{
      itemContents.sort((a, b) => a.price - b.price);
    } 
    itemTitles.forEach((title, index)=> {
      title.textContent = itemContents[index].name;
    });
    priceTags.forEach((price, index) => {
      price.textContent = itemContents[index].price;
    });
    imgTag.forEach((img, index) => {
      img.src = itemContents[index].img;
    });
  });

  

  // カートボタンを押した際の処理
  cart_btns.forEach(function (cart_btn,index) {
    cart_btn.addEventListener('click',function () {

      // カートボタンがすでに押されているかの判定
      if (clicked.indexOf(index) >= 0) {

        for (var i = 0; i < clicked.length; i++) {
          if(clicked[i] == index){
            clicked.splice(i, 1);
            save_items.splice(i, 1);
          }
        }

        inactivate_btn(index);

      }else if(clicked.indexOf(index) == -1){

        var name = itemContents[index].name,//商品の名前を取得
        price = Number(itemContents[index].price);//商品の値段を取得

        clicked.push(index);
        save_items.push({
          id: index,
          name: name,
          price: price
        });

        activate_btn(index);

      }

      // ローカルストレージに商品データを保管
      localStorage.setItem("items",JSON.stringify(save_items));

    });
  });

  function activate_btn(index) {
    cart_cnt++;
    if( cart_cnt >= 1 ){
      cart_cnt_icon.parentNode.classList.remove('hidden');
    }
    cart_cnt_icon.innerHTML = cart_cnt;
    cart_btns[index].classList.add('item_cart_btn_active');
  }

  function inactivate_btn(index) {
    cart_cnt--;
    if(cart_cnt == 0){
      cart_cnt_icon.parentNode.classList.add('hidden');
    }
    cart_cnt_icon.innerHTML = cart_cnt;
    cart_btns[index].classList.remove('item_cart_btn_active');
  }

};




