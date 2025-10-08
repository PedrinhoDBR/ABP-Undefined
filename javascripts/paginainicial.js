

// Carrosel

// const lista = new SimpleLinkedList()


let slideAtual = 0;

const slides = document.querySelectorAll(".carrosel")

// slides.forEach((slide => {
//     lista.add(slide)
// }))

// function paraCada(lista, func){
//     for(let i = 0; i<lista.length ; i++){
//         func(lista[i])
//     }
// }

// paraCada(slides, (a) => {
//     lista.add(a)
// })



const slide0 = document.querySelector("#slide0")

const slide1 = document.querySelector('#slide1')

const leftArrow = document.querySelector("#leftArrowNews")

const rightArrow = document.querySelector("#rightArrowNews")


leftArrow.addEventListener('click', () => {

    if(slideAtual == 2){
                    slideAtual--
 slides.forEach((slide => {
            slide.style.transition = 'transform 200ms'
            slide.style.transform = "translate(-100%)"
            
         }))

    }
    else if(slideAtual == 1){
                            slideAtual--
 slides.forEach((slide => {
            slide.style.transition = 'transform 200ms'
            slide.style.transform = "translate(0%)"
            
         }))
        

    }
    else{
        slideAtual = 2
 slides.forEach((slide => {
            slide.style.transition = 'transform 200ms'
            slide.style.transform = "translate(-200%)"
            
         }))
    }

    
})




rightArrow.addEventListener('click', () => {
 
        // lista.next()
         if(slideAtual == 0){
            slideAtual++
 slides.forEach((slide => {
            slide.style.transition = 'transform 200ms'
            slide.style.transform = "translate(-100%)"
            
         }))

         }  
         else if(slideAtual == 1){
             slideAtual++
 slides.forEach((slide => { 
            slide.style.transition = 'transform 200ms'
            slide.style.transform = "translate(-200%)"
            
         }))

         }

         else{
            slideAtual = 0
 slides.forEach((slide => { 
            slide.style.transition = 'transform 200ms'
            slide.style.transform = "translate(0%)"
            
         }))
         }

         
         

          
        
        
})















// class SimpleLinkedList{
//     constructor(list=[], current=0){
//         this.list = list
//         this.current = current
//     }

//     renderLeft(){
        
//     }

//     previous(){
//         if(this.current == 0){
//             this.current = this.list.length - 1
//         } else {
//             this.current--
//         }
//         this.renderLeft()
//     }

//     getCurrent(){
//         return this.list[this.current]
//     }

//     next(){
//         if(this.current == this.list.length - 1){
//             this.current = 0
//         } else {
//             this.current++
//         }
//         this.renderRight()
//     }

//     add(data){
//         this.list.push(data)
//     }


// }


