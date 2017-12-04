/**
 * Created by Vin on 03/12/2017.
 */
//init jquery

var elem = document.querySelector('.carousel');
<<<<<<< HEAD
var instance = new M.Carousel(elem, {
    duration:40
});

function spin() {
    /*
     let decision = Math.floor(Math.random()*5);
     console.log(decision);
     let delay = 100;
     console.log(delay);
     for(let i = 0; i<(decision+delay); i++){

     setTimeout(function () {
     instance.next();

     },i*100);
     }*/

    let loops = (Math.floor(Math.random() * 5) + 25);
    let last = 50;

    for (let i = 0; i < loops; i++) {
        setTimeout(function () {
            instance.next();
        }, i * 100);
    }
    ;


}
window.onload = spin;


const getDelay = (i) =>{
    if (i > 99){
        return 300;
    }
    if (i > 90){
        return 200;
    }
    else if(i>75){
        return 150;
    }
    else if(i>50){
        return 100;
    }
    else{
        return 70;
    }
};
//decide on prize
//0 = bottle
//1 = coffee
//2 = fika
//3 = tour
//4 = towel


=======
var instance = new M.Carousel(elem);

function spin(){
    instance.next(3);
}

window.onload = spin;

//decide on prize
//
>>>>>>> f637676ccb97ac45cfbf4187e82067355c9d9162
