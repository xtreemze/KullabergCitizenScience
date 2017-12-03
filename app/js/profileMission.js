const Mission = require("./missions");
const loadImage = require("blueimp-load-image");

const xpTable = [100, 125, 160, 200, 260, 340, 450, 600, 820, 1100, 1500, 2000, 3000, 4500, 6000, 9000, 13000, 18000, 25000];

class ProfileMission {
    constructor() {
        this.shortName = "profile";
        this.profileImage = localStorage.getItem("profileImage");
        this.username = localStorage.getItem("username");
        this.userExperience = localStorage.getItem("userExperience");
        this.userLevel = [1, 0];
        this.mission = new Mission({
            card: `
<div class="cardContainer" id="${this.shortname}">
  <div class="col s12 m6 l6">
    <div class="card">
      <div class="card-content" style="text-align: center;">
           <input id="photoFilePath" accept="image/*" class="file-path validate" type="file" class="circle imageChanger ${this.profileImage ? "hide" : ""}" onchange="profile.uploadImage(this)" style="background-image: url(${require("./../img/Portrait_Placeholder.png")});width: 150px;height: 150px;background-size: 150px;">
            <canvas id="profileCanvas" width="150px" height="150px" class="${this.profileImage ? "" : "hidden"}" style="margin: -200px 0 16px 0;"></canvas>
        <div id="profile_username" style="font-size: 30px">${this.username}</div>
          <div class="progress">
              <div class="determinate" style="width: ${this.userLevel[1]}%;"></div>
      </div>
      <div> Level ${this.userLevel[0]}</div>
  <div class="card-content ${this.username ? "hide" : ""}" style="text-align: center;" id="personalExperience">
      <h6>Personalize Your Experience!</h6>
   
   <div class="input-field">
          <input id="user_name" type="text" autocomplete="off">
          <label for="user_name" class="">Your Name</label>
          <a class="waves-effect waves-light btn" id="submitButton" onclick="profile.changeUsername(this)"><i class="material-icons right">send</i>Submit</a>
   </div>
   </div>
      <div><h6>Badge Collection</h6></div>
      <div class="card-action" style="padding-left: 0; padding-right:0;">
       <img src=${require("./../img/Flag_of_None.svg.png")} style="width: 50px; margin: 4px 4px 0 4px;" class="circle">
       <img src=${require("./../img/Flag_of_None.svg.png")} style="width: 50px; margin: 4px 4px 0 4px;" class="circle">
       <img src=${require("./../img/Flag_of_None.svg.png")} style="width: 50px; margin: 4px 4px 0 4px;" class="circle">
       </div>
       </div>
       </div>
       </div>
       </div>
        <script>
        </script>`
        });


    }
    uploadImage(e) {
        let reader = new FileReader();
        reader.onload = function (f) {
            console.log(reader);
            console.log(f);
                let profileCanvas = document.getElementById("profileCanvas");
                let ctx = profileCanvas.getContext("2d");
                let img = new Image();
                img.height = profileCanvas.height;
                img.width = profileCanvas.width;
                img.src = reader.result;
                img.onload = function () {
                    this.profileImage = img;
                    ctx.drawImage(this.profileImage,0,0,150,150);
                    localStorage.setItem("profileImage", profileCanvas.toDataURL("image/jpeg", 0.5));
                }

                e.classList.add("hide");
        };
        reader.readAsDataURL(e.files[0]);
    };

    changeUsername(e) {
        this.username = document.getElementById("user_name").value;
        localStorage.setItem("username", this.username);
        document.getElementById("personalExperience").classList.add("hide");
        document.getElementById("profile_username").innerHTML = this.username;
    };

    calcLevel(xp) {
        for (let i = 0; i < 20; i++) {
            if (!((xp - xpTable[i]) < 0)) {
                xp -= xpTable[i];
            } else {
                userLvl[0] = i + 1;
                userLvl[1] = (xp / xpTable[i]) * 100;
                break;
            }
        }
    }

}

profile = new ProfileMission();