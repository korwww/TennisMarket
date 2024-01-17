const fs = require('fs');
const main_view = fs.readFileSync('./main.html', 'utf-8');
const orderlist_view= fs.readFileSync('./orderlist.html');

const mariadb = require('./database/connect/mariadb');

function main(response){
    const products = [
        { id: 1, img: './img/redRacket.png', title: 'Red Racket' },
        { id: 2, img: './img/blueRacket.png', title: 'Blue Racket' },
        { id: 3, img: './img/blackRacket.png', title: 'Black Racket' }
    ];
    console.log('main');

    mariadb.query("select * from product", function(err, rows){
        console.log(rows);
    });

    let newMainView = main_view.substring(0, main_view.lastIndexOf('</div>'));
    products.forEach(product => {
        newMainView += `
            <div class="card">
                <img class="card_img" src="${product.img}">
                <p class="card_title">${product.title}</p>
                <input class="card_button" type="button" value="order" onclick="location.href='/order?productId=${product.id}'">
            </div>
        `;
    });
    newMainView += `
    </body>
    </html>
    `;
    response.write(newMainView);
    response.end();
}

function redRacket(response){
    fs.readFile('./img/redRacket.png', function(err, data){
        response.writeHead(200, {'Content-Type' : 'text/html'});
        response.write(data);
        response.end();
    });
}
function blueRacket(response){
    fs.readFile('./img/blueRacket.png', function(err, data){
        response.writeHead(200, {'Content-Type' : 'text/html'});
        response.write(data);
        response.end();
    });
}
function blackRacket(response){
    fs.readFile('./img/blackRacket.png', function(err, data){
        response.writeHead(200, {'Content-Type' : 'text/html'});
        response.write(data);
        response.end();
    });
}
function cssFile(response){
    fs.readFile('./style.css', function(err, data){
        response.writeHead(200, {'Content-Type' : 'text/css'});
        response.write(data);
        response.end();
    });
}
function order(response, productId){
    response.writeHead(200, {'Content-Type' : 'text/html'});

    mariadb.query("INSERT INTO orderlist VALUES ("+ productId + ", '" + new Date().toLocaleDateString() + "');", function(err, rows){
        console.log(rows);
    });

    response.write(main_view);
    response.end();
}
function orderlist(response){
    console.log('orerlist');
    
    response.writeHead(200, {'Content-Type' : 'text/html'});
       
    mariadb.query("SELECT * FROM orderlist", function(err, rows){
        response.write(orderlist_view);

        rows.forEach(element=>{
            response.write("<tr>"
                            +"<td>"+element.product_id+"</td>"
                            +"<td>"+element.order_date+"</td>"
                            +"</tr>");
        });

        response.write("</table>");
        response.end();
    }) 
}
let handle = {};    //key: value
handle['/']= main;
handle['/order'] = order;
handle['/orderlist.html'] = orderlist;

/* image directory */
handle['/img/redRacket.png'] = redRacket;
handle['/img/blueRacket.png'] = blueRacket;
handle['/img/blackRacket.png'] = blackRacket;

handle['/style.css'] = cssFile;

exports.handle = handle;