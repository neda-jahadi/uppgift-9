let book='';
const apiUrl = 'https://www.forverkliga.se/JavaScript/api/crud.php?';
let baseUrl = apiUrl;
let defaultKey = 2;
console.log('1 Script started');
window.addEventListener('load', () => {
	console.log('2 Window load event');

	
	let keyButton = document.querySelector('#getKey');
	keyButton.addEventListener('click',  async event => {
		console.log(' Clicked on to get key');
        let keyUrl= `${apiUrl}requestKey`;
        let keyMessage= document.querySelector('.keyMessage');
        keyMessage.innerHTML = '';
        for (let i=0; i<5; i++){
            try{
                const keyResponse = await fetch(keyUrl)
                const keyData = await keyResponse.json();
                
                console.log('key is: ', keyData.key);
                if (keyData.status==='success'){
                    console.log('Got key: ', keyData);
                    defaultKey = keyData.key;
                    console.log('Key is: ' + defaultKey);
                    baseUrl = `${apiUrl}key=` + defaultKey;
                    let keyDiv = document.querySelector('.keyDiv');
                    keyMessage.innerHTML = 'Now it is ready to work here...';
                    i=6;
                }else if ((keyData.status==='error')&&(i==4)){
                    keyMessage.innerHTML = `It is not successful to get the key after ${i+1} try(ies)`;
                }
            }
            catch(error){
                keyMessage.innerHTML = 'Something went wrong. The error is: ' + error;
            }

        }
        
         
    });
    
    let addButton = document.querySelector('#add');
    addButton.addEventListener('click', async event=> {
        let myBooks = document.createElement('div');
        let addDiv = document.querySelector('.addDiv');
        let titleInput = document.querySelector('#title');
        let authortInput = document.querySelector('#author');
        let title = titleInput.value;
        let author = authortInput.value;
        let showAddResult = document.querySelector('#ShowAddResult');
        showAddResult.innerHTML = '';
        
       
        let addUrl = `${baseUrl}&op=insert&title=${title}&author=${author}`;
        for(let i=0; i<5; i++){
            
            
            try {
                const response = await fetch(addUrl)
                const data = await response.json();
                if(data.status==='success'){
    
                    
                    console.log(`The latest request(the ${i+1}th one) to API was successful`);
                    
                    showAddResult.innerText = 'Book is added!...\n';
                    showAddResult.innerText += `The adding was successfull after ${i+1} time(s) try`;
                    
                   
                    i=6;
                }
                else if((data.status==='error')&&(i==4)){
                   
                    showAddResult.innerText = `We had ${i+1} unsuccessful try(ies) to add the book`;
                    showAddResult.innerText += '\n Try the add botton again!';
                   
                    console.log(`The latest request(the ${i+1}th one) to API was unsuccessful`);
                }
                console.log( data);
            }
            catch(error) {
                showAddResult.innerHTML = 'Something went wrong with adding! The error is: ' + error;
                console.log('Something went wrong! The error is: ', error);
            }
            
            
        
            
        
        }
        
    })
     
    let viewButton = document.querySelector('#viewButton');
    let viewDiv = document.querySelector('#showBooks');
    let viewResult = document.querySelector('#viewResult');
    
    viewButton.addEventListener('click' , async event =>{
        console.log('view button clicked');
        let viewUrl = `${baseUrl}&op=select`;
        viewDiv.innerText = '';
        for (let i=0; i<5; i++){
           
          try {
            const response = await fetch(viewUrl)
            const info = await response.json();
            if(info.status==='success'){
                viewResult.innerText = 'Books are viewed!\n';
                viewResult.innerText += `The successful view result after ${i+1} try :`;
                console.log(`The latest request(the ${i+1}th one) to API was successful`);
                console.log('information:', info);
                let addedBooks = info.data;
                addedBooks.forEach(b => {

                    let bookElement = createBookDOM(b);
                    
                    
                    
                    viewDiv.appendChild(bookElement);
                
                });
                console.log('added books :', addedBooks);
                
                
    
                i=6;
            }
             else if((info.status==='error')&&(i==4)){
                viewResult.innerText = `Vi had ${i+1} unccessful try ...\n`;
                viewResult.innerText += 'Click again the view button!';
                console.log(`The latest request(the ${i+1}th one) to API was unsuccessful`);
            }
             
            }
          
            catch(error) {
                viewResult.innerText ='Something went wrong with viewing! The error is:' + error;
          }
        }

    })
       
    function createBookDOM(receivedBook) {
       
        let messageContainer = document.createElement('div');
        messageContainer.innerHTML = 'Result messages here:';
        let modifyButton = document.createElement('button');
        let deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete!';
        modifyButton.innerText = 'Modify!';
        let modifyMessage = document.createElement('span');
        let deleteMessage = document.createElement('span');
        deleteMessage.innerHTML = '';
        modifyMessage.innerHTML = '';  
        let bookTitle = document.createElement('input');
        let bookAuthor = document.createElement('input');
        let bookContainer = document.createElement('div');
        bookContainer.className = 'bookContainer';
        modifyMessage.className = 'messageContainer';
        deleteMessage.className = 'messageContainer';
        bookTitle.value = receivedBook.title;
        bookAuthor.value = receivedBook.author;
        let bookT= bookTitle.value;
        let bookA= bookAuthor.value;
      
        bookContainer.appendChild(bookTitle);
        bookContainer.appendChild(bookAuthor);
        bookContainer.appendChild(modifyButton);
        bookContainer.appendChild(deleteButton);
       
        
        bookContainer.appendChild(messageContainer);
        modifyButton.addEventListener('click', async event=>{
            
            console.log('the modify button is clicked!');
            let modifyUrl = `${baseUrl}&op=update&id=${receivedBook.id}&title=${bookTitle.value}&author=${bookAuthor.value}`;
            
            for (let j=0; j<5; j++){
               try{
                const modifyResponse = await fetch(modifyUrl);
                const modifyResult = await modifyResponse.json();
                
                if(modifyResult.status==='success'){
                    modifyMessage.innerHTML = `The modify result is successful after ${j+1} try(ies)`;
                    
                    
                    console.log('The modify request was successful');
                    console.log('modify result is: ', modifyResult);
                    j=6;
                }else if ((modifyResult.status==='error')&&(j==4)){
                    modifyMessage.innerHTML = `The modify result is unsuccessful after ${j+1} try(ies). Click again!`;
                    
                    console.log('click on modify button again');
                } 
                
               } 
               catch (error){
                 modifyMessage.innerHTML = 'Something went wrong! The error is:' + error;
                 
               }
               messageContainer.appendChild(modifyMessage);
               
            }
            
        })

        deleteButton.addEventListener('click', async event=>{
           
            let deleteUrl = `${baseUrl}&op=delete&id=${receivedBook.id}`;
            modifyMessage.innerHTML = '';
            
            for (let j=0; j<5; j++){
               try{
                const deleteResponse = await fetch(deleteUrl);
                const deleteResult = await deleteResponse.json();
                if(deleteResult.status==='success'){
                    deleteMessage.innerHTML = `The delete result is successful after ${j+1} try(ies).`;
                    
                    console.log('The delete request was successful');
                    console.log('delete result is: ', deleteResult);
                    j=6;
                }else if ((deleteResult==='error')&&(j==4)){
                    deleteMessage.innerHTML = `The delete result is unsuccessful after ${j+1} try(ies). Click again!`;
                    
                    console.log('click on delete button again');
                } 
                
               } 
               catch (error){
                 deleteMessage.innerHTML = 'Something went wrong! The error is:' + error;
                 
               }
               messageContainer.appendChild(deleteMessage);
            }
            
        })
        
        return bookContainer;
    }   
    
	
});

