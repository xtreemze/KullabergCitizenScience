/**
 * Created by Vin on 03/12/2017.
 */
//init jquery

var elem = document.querySelector('.carousel');
var instance = new M.Carousel(elem);

function spin(){
    instance.next(3);
}

window.onload = spin;

//decide on prize
//