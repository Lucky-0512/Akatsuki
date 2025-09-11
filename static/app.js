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
    learboard.innerHTML = ''
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

// by default we show up the room : lifetalks on screen.
socket.emit('channel_triggered',{'status':true,'room':"lifetalks"}) 

channels.forEach((el)=>{
    el.addEventListener('click',()=>{  // going through everychanngel and check for the channel toggled.
        const room_title = document.getElementById('room_title')
        room_title.textContent = el.textContent

        // loading up all the data from the server on toggling.

        // emitting a socket event.
        if(el.id == "gen"){
            chat_interface.innerHTML = ''
            // sending the triggerd channel/room name to the server
            socket.emit('channel_triggered',{'status':true,'room':"lifetalks"}) 
                    }
        else if(el.id == "muscle"){
            chat_interface.innerHTML = ''
            socket.emit('channel_triggered',{'status':true,'room':"muscle"})
        }
        else if(el.id == "money"){
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
                socket.emit('fetch_msgs',{'toroom':prep_info.room,'msg_value':prep_info.msg_content,'name':prep_info.name})


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
            
            // telling flask listerner 'cha' that listens for data and inserts into DB.
            socket.emit('cha',{'token':prep_info.token,'email':prep_info.email,'msg_content':prep_info.msg_content,'name':prep_info.name,'room':prep_info.room})
            
        /*
                    
            // we can simple add divs to the chat intreface on client side. but it will show up irrespective of the channel triggerd.
            // so we need to append it only to the users currently active in that chat interface.
            // update on the above Lines : actually this is fixed and the data wont refelct, coz i used Join_rooms(room)
        */

        }
    
    }
})


//A socket listenr that listneis to message sent by server to broadcast it to all users confined to a scpeific room.
socket.on('addoff',(data)=>{
                   
    // do these once the server boradcatss.
    const msg_holder = document.createElement('div')

    
    msg_holder.innerHTML = `
            <div class='data_name'><u>${data.name}</u></div>
            <div class="data_msg_value">${data.msg_value}</div>
            <div class="data_time">${data.time}</div>
            `

    msg_holder.style.display = 'flex';
    msg_holder.style.flexDirection = 'column';

    const data_name = msg_holder.querySelector('.data_name')
    const data_msg_value = msg_holder.querySelector('.data_msg_value')
    const data_time = msg_holder.querySelector('.data_time')

    // setting the css styling for time div
    data_time.style.height='15%'
    data_time.style.fontSize='x-small'
    data_name.style.height = '65%'
    data_time.style.textAlign = 'right'

    // setting the css styling for user_name div
    data_name.style.textAlign = 'left'
    data_name.style.fontSize = 'small'
 

    msg_holder.classList.add('chatbubble_own')
    chat_interface.appendChild(msg_holder)
    msg_ip.value = ""
    })


 //and also the JS should handle the message box div's positon efore append it to the div.
 //i.e if the msg token_no asscociated = session[token] i.e is th current user's token, then append it to the left.
//for al the other msgs , append it to the right.
    


socket.on('got_fetched?',(data)=>{
    const content_list = data.msg_list;  
        
         content_list.forEach((i) =>{
            
        if(i[0] == data.token_type){     
            console.log(i[0] == data.token_type)
            // put it in DIV and append as child of the right of the div.
            const div_load = document.createElement('div')
            div_load.innerHTML = `
            <div class='data_msg_value'>${i[2]}</div>
            <div class='data_time'>${i[3]}</div>`

            div_load.style.display = 'flex';
            div_load.style.flexDirection = 'column';

            const data_time = div_load.querySelector('.data_time')

            // setting the css styling for time div
            data_time.style.height='15%'
            data_time.style.fontSize='x-small'
            data_time.style.textAlign = 'right'

            chat_interface.appendChild(div_load)  
            div_load.classList.add('chatbubble_own')
          
        }

        else{

            // put it in DIV and append as child of the left of the div.
            const div_load = document.createElement('div')
            div_load.innerHTML = `
            <div class='data_name'><u>${i[1]}</u></div>
            <div class='data_msg_value'>${i[2]}</div>
            <div class='data_time'>${i[3]}</div>`

            div_load.style.display = 'flex';
            div_load.style.flexDirection = 'column';


            const data_name = div_load.querySelector('.data_name')
            const data_msg_value = div_load.querySelector('.data_msg_value')
            const data_time = div_load.querySelector('.data_time')

            // setting the css styling for time div
            data_time.style.height='15%'
            data_time.style.fontSize='x-small'
            data_name.style.height = '65%'
            data_time.style.textAlign = 'right'

            // setting the css styling for user_name div
            data_name.style.textAlign = 'left'
            data_name.style.fontSize = 'small'
 
        chat_interface.appendChild(div_load)  
            div_load.classList.add('chatbubble_others')

            
        }



        chat_interface.scrollTop = chat_interface.scrollHeight;         // telloing the scroll bar to scroll top until the scroll height => to fetch the latest msg        
    

    })


})    



// to load up all the members of the server when a user joins!

const members_box=document.getElementById('members')

// get the message input box.
const chat_ip_element = document.getElementById('chat_ip') 

// get div to store list of members
const list_div = members_box.querySelector('#member_list')

let list_active_typing; 

socket.on('load_members',(data)=>{
    list_div.innerHTML = '';
    const mem_list = data.list
    const mem_list_active = data.list_active
    const mem_list_inactive = data.list_inactive
    list_active_typing = mem_list_active

    mem_list.forEach((i)=>{
        const list_bubble = document.createElement('div')
        list_bubble.setAttribute('class','listbubbly')
        list_bubble.classList.add('listbubble')
        list_bubble.setAttribute('data-user',`${i}`)


        if(mem_list_active.includes(i)){
            list_bubble.innerHTML = `
            <div style ='font-size:medium;font-family:mcregular' class='mem_name'>${i}</div>
            <div class='indicator'>${'🟢'}</div>
            `

        }
        else{
            list_bubble.innerHTML = `
            <div style ='font-size:medium;font-family:mcregular' class='mem_name'>${i}</div>
            <div class='indicator'>${'🔴'}</div>
            `

        }

        // apped the list bubbe to the list_div.

        list_div.appendChild(list_bubble)

 

    })

})

let typingTimer 
let data_name='';
// getting the session[name]
socket.on('session_data',(data)=>{
    data_name = data.name  // this gives th name of the current user.
        
        })

let event_triggered = false;         

chat_ip_element.addEventListener('input',()=>{
    event_triggered = true

    const bubbly = list_div.querySelectorAll('.listbubbly') 
    bubbly.forEach((i)=>{
        const indicator = i.querySelector('.indicator')
        const mem_name = i.querySelector('.mem_name')
        if(mem_name.textContent == data_name){
            indicator.textContent = 'typing...'
        } 


    })

    if(event_triggered){
        event_triggered = false
        clearTimeout(typingTimer); // clearing the previous timer
        typingTimer = setTimeout(() => {
        socket.emit('stop_typing', {'user': data_name });
        console.log(data_name)
    
    
      }, 2000); // 2s inactivity - then only uu emit to flask saying that the user has stopped typing and canel the status bolke.
    }

    console.log('user released it!')

})





socket.on('reset_back_status',(data)=>{
    console.log('i got it bruhh! ')

    // get the vaue of mem_list_active.
    const mem_list_active = list_active_typing
    console.log(mem_list_active)
    const get_user_bubble = list_div.querySelector(`[data-user ="${data.name_user}"]`)  // usign custom attributes to pick div of matchingn name. 
 
    if(get_user_bubble){
            const indicator = get_user_bubble.querySelector('.indicator')
            console.log('kellymalesss!')
            if( mem_list_active.includes(data.name_user)){

                indicator.textContent = '🟢'
            }
            else{
                indicator.textContent = '🔴'
                //console.log(false)

            }
        }

        else{
            
        console.log('user bubble doesnt exist!')
        }


    })




