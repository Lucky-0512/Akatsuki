// our frontend 

const faq = document.querySelectorAll(".faq")
const auth_box  =document.getElementById("box_login")
const style_tag = document.createElement("style")

const textMap = {
    faq1: "faq1mama",
    faq2: "faq2mama",
    faq3: "faq3mama",
    faq4: "faq4mama"
};

const questions = {
    faq1: "* how tokenization works ?",
    faq2: "* contact details",
    faq3: "* Terms and conditions",
    faq4: "* spam / NFSW blocker"

}


if(faq){
    faq.forEach(i => {
        i.addEventListener("click", () => {
            const isOpen = i.classList.contains("open");
            i.classList.toggle("open");
            i.textContent = isOpen ? questions[i.id] : textMap[i.id];
        });
    });
    
    
}


const reg_button = document.getElementById("register_button")
const login_button = document.getElementById("id_button")


if(reg_button){
    reg_button.addEventListener("click",()=>{
   
        auth_box.style.backdropFilter = "blur(10px)"
        auth_box.style.backdropFilter = "saturate(40%)"
    })
    
}


if(login_button){
    login_button.addEventListener("click",()=>{
        auth_box.style.backdropFilter = "blur(10px)"
        auth_box.style.backdropFilter = "saturate(40%)"
    })
}



//checking otp validation

const otpstatus = document.getElementById("verify")

async function handle_otp(){
    const otpvalue = document.getElementById("otpvalue")
    if (!otpvalue) {
        console.warn("otpvalue not found. Skipping handle_otp()");
        return;
    }
    const getval = otpvalue.value

    console.log("running")
    const res = await fetch("/verify-otp",{   // this is a classic request structure of JS. 
        method :  "POST",  // request type
        headers: {
            "Content-Type": "application/json"   // content type
          },
        body: JSON.stringify({ otp: getval }) // stringify is gonna covert th json object into a JSON string
    })

    const data = await res.json()
    console.log(data)

    if (data.status === "fail"){
        window.alert(`${data.message} try again!`)
        window.location.href = "/";

    }

    else{
        window.location.href = "/passwd_box";
        /*if ( document.getElementById("otp_sent_desc").textContent == "Enter the OTP sent to your email to reset password"){
            window.location.href = "/reset_pass.html"
        }

        else if(document.getElementById("otp_sent_desc").textContent == "Enter the OTP sent to your email to verify"){
            window.location.href = "/passwd_box";
        }*/

        

    }

}

const otp_element = document.getElementById("otpvalue")

if(otp_element){
    otp_element.addEventListener("keydown",(e)=>{
        if(e.key == "Enter"){
            handle_otp()
        }
    })
}


if(otpstatus){
    otpstatus.addEventListener('click',()=>{
        handle_otp()
    })
}

/****************************************************************************************************************************/

const verilog = document.getElementById("verify_login")  // The button

// this function is dedicated to redirect users to server while login based on otp.
async function handle_otp_login(){
    const otpvalue_login = document.getElementById("otpvalue_login")
    if (!otpvalue_login) {
        console.warn("otpvalue not found. Skipping handle_otp()");
        return;
    }
    const get_wal = otpvalue_login.value
    console.log("running")
    const res = await fetch("/verify-otp-login",{   // this is a classic request structure of JS. 
        method :  "POST",  // request type
        headers: {
            "Content-Type": "application/json"   // contnt type
          },
        body: JSON.stringify({ otp_login: get_wal }) // stringify is gonna covert th json object into a JSON string
    })

    const data = await res.json()
    console.log(data)

    if (data.status === "fail"){
        window.alert(`${data.message} try again!`)
        window.location.href = "/";

    }

    else{
        

        window.location.href = "/serve";
        
       

    }


}


if(verilog){
    verilog.addEventListener("click",()=>{
        console.log("ss i got triggered!!!!")
        handle_otp_login()
    }

    )

    
    verilog.addEventListener("keydown",(e)=>{

        if (e.key == "Enter"){
            handle_otp_login()
        }
              
    })

}


//////////////////////////////////////////////////// COMMUNICATION UING WEB SCOKETS ////////////////////////////////////////

// addig use data to leader board.

const learboard = document.getElementById("leaderboard")
socket.on('leaderboard',(data)=>{
    data.forEach((el)=>{
        const div = document.createElement("div")
        if (div.textContent){
            div.textContent = ''
        }
        else{
            div.textContent = `${el[0]} : ${el[1]}`
            learboard.appendChild(div)
        }

    })
})


// showing the user Xp.

const user_XP = document.getElementById("ur_XP")

socket.on('user_XP',(data)=>{
    const div_user_XP = document.createElement("div")
    div_user_XP.textContent = `your highest XP this month : ${data}`
    user_XP.appendChild(div_user_XP)
    console.log(data)
        
})

socket.on('profile_data',(data)=>{

    const prof_pic = document.getElementById('prof_pic')
    const prof_name = document.getElementById('prof_name')
    const xp = document.getElementById('prof_XP')
    const age = document.getElementById('age')
    const hobby = document.getElementById('prof_hobby')
    const status = document.getElementById('status')
    const tok_no = document.getElementById('tok_no')
    
    // adding img dynmically to the div.
    const prof_img = document.createElement('img')
    prof_img.src =`${data[4]}` 
    prof_img.style.width = "150px"
    prof_img.style.height = "150px"
    prof_img.style.borderRadius = "100px"
    prof_pic.appendChild(prof_img)
    prof_name.textContent = ` name : ${data[2]}`
    age.textContent = "age : 0 yrs"   // this columns needs to be updted in the table too. with an edit option indeed!
    hobby.textContent = "killing" // lol, im joking do the same here too
    xp.textContent = `XP : ${data[5]}`
    status.textContent = `status : ${data[3]}`
    tok_no.textContent = `token : ${data[0]}`


    
})



// let's logut the user from the session on hitting the logout button on the menu bar.

const logout_button = document.getElementById('exit_door')

logout_button.addEventListener('click',()=>{
    socket.emit('logout', true)
    
})

socket.on('logemout',(data)=>{
    if (data == true){
        window.location.href = '/';
    }
})


// implementing close button for profilr box.

const prof_box_exit = document.getElementById('exit')
const profile_box = document.getElementById("profile_box")
const user_icon = document.getElementById('user')


prof_box_exit.addEventListener('click',()=>{
    if (profile_box.classList.contains('exit_button_profile_show')){
        profile_box.classList.remove('exit_button_profile_show')
       
    }
    profile_box.classList.add('exit_button_profile_hide')
    
})


user_icon.addEventListener('click',()=>{
    if (profile_box.classList.contains('exit_button_profile_hide')){
        profile_box.classList.remove('exit_button_profile_hide')
       
    }
    profile_box.classList.add('exit_button_profile_show')
    
        
})


////////////////////// CHANNELS TRIGGERINGGGGG ///////////////////////////////////

const channels = document.querySelectorAll('.channels')

channels.forEach((el)=>{
    el.addEventListener('click',()=>{  // going through everychanngel and check for the channel toggled.
        const room_title = document.getElementById('room_title')
        room_title.textContent = el.textContent

        // loading up all the data from the server on toggling.

        // emitting a socket event.
        if(el.textContent == "# life-talks 🍉"){
            chat_interface.innerHTML = ''
            // sending the triggerd channel/room name to the server
            socket.emit('channel_triggered',{'status':true,'room':"lifetalks"}) 
                    }
        else if(el.textContent == "# muscle 💪"){
            chat_interface.innerHTML = ''
            socket.emit('channel_triggered',{'status':true,'room':"muscle"})
        }
        else{
            chat_interface.innerHTML = ''
            socket.emit('channel_triggered',{'status':true,'room':"money"})
        }
        
    })

})


///////////// USER STATTUS TRIGGERING HEN HE/SHE JOINS / LEAVES THE CHAT UI.

const user_status = document.getElementById('user_status')

socket.on('user_joined',(data)=>{
    user_status.textContent = data
    console.log(data)

})

// let's add the user text functionality.
const msg_ip = document.getElementById('chat_ip')
const chat_interface = document.getElementById('chat_interface')


let session_data = null;
// socket listener to recievr sessions data from server.
socket.on('session_data',(data)=>{
    session_data = data;
                
                
})      



// this event listener to insert the user netered in the db and ask server to fetch msg so that JS can erecive the same msg and add it to div, (via another listener)
const room_title = document.getElementById('room_title');

msg_ip.addEventListener('keydown',(e)=>{
    if(e.key === "Enter"){
        if(msg_ip.value !== ''){
            // this set of data has the user_msg copntent field that is sent to server.
            const prep_info = {'token':`${session_data.token}`,"msg_content":`${msg_ip.value}`,'room':'lifetalks','email':`${session_data.email}`,'name':`${session_data.name}`}

            if(room_title.textContent == "# life-talks 🍉"){
                prep_info.room = 'lifetalks'

                  // telling srvr to broadcast msg 
                socket.emit('fetch_msgs',{'toroom':prep_info.room,'msg_value':prep_info.msg_content})


            }

            else if(room_title.textContent == "# muscle 💪"){
                 prep_info.room = 'muscle'
   
              
                // telling srvr to load up all msg ist of room = muscle.
                socket.emit('fetch_msgs',{'toroom':prep_info.room,'msg_value':prep_info.msg_content})
                
            }

            else if(room_title.textContent == "# money 💰" ){
                prep_info.room = 'money'
                
                // telling srvr to load up all msg ist of room = moey.
                socket.emit('fetch_msgs',{'toroom':prep_info.room,'msg_value':prep_info.msg_content})

            }
            /*
        channels.forEach((el)=>{
            
            
            // we can simple add divs to the chat intreface on client side. but it will show up irrespective of the channel triggerd.
            // so we need to append it only to the users currently active in that chat interface.
            // update on the above Lines : actually this is fixed and the data wont refelct, coz i used Join_rooms(room)
            
            if(el.textContent == "# life-talks 🍉"){
                
 
              
                
            }
            
            else if(el.textContent == ){
               
            }
            
            else if(el.textContent == ){
                prep_info.room = 'money'
               // chat_interface.innerHTML = ''
                
                // telling srvr to load up all msg ist of room = moey.
                socket.emit('fetch_msgs',{'toroom':prep_info.room,'msg_value':prep_info.msg_content})

            }

            socket.emit('cha',prep_info)  // emit event caught by a socket listener on app.py that listens and insert the field in DB.


        
                })*/

        }
    

    }
})

//A socket listenr that listneis to message sent by server to broadcast it to all users confined to a scpeific room.
socket.on('addoff',(data)=>{
                   
    // do these once the server boradcatss.
    const msg_holder = document.createElement('div')
    msg_holder.textContent = data
    msg_holder.classList.add('chatbubble_own')
    chat_interface.appendChild(msg_holder)
    msg_ip.value = ""
    })


 //and also the JS should handle the message box div's positon efore append it to the div.
 //i.e if the msg token_no asscociated = session[token] i.e is th current user's token, then append it to the left.
//for al the other msgs , append it to the right.
    


socket.on('got_fetched?',(data)=>{
    //const msg_token_list = data.msg_list.map(i => i[0])
    //const msg_main_list = data.msg_list.map(i => i[1]) 
    const content_list = data.msg_list;  
        
         content_list.forEach((i) =>{
            
        if(i[0] == data.token_type){     
            console.log(i[0] == data.token_type)
            // put it in DIV and append as child of the right of the div.
            const div_load = document.createElement('div')
            div_load.classList.add('chatbubble_own')
            div_load.textContent = i[1]
            chat_interface.appendChild(div_load)   
            
    
        }

        else{

            // put it in DIV and append as child of the left of the div.
            const div_load = document.createElement('div')
            div_load.classList.add('chatbubble_others')
            div_load.textContent = i[1]
            chat_interface.appendChild(div_load)   
            
        }

        chat_interface.scrollTop = chat_interface.scrollHeight;         // telloing the scroll bar to scroll top until the scroll height => to fetch the latest msg        
    

    })


})    

