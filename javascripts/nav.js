void function getUpdateDate(gitData){
    var script, htmlExtension, nameAndExtension, fileName
    
    script           = document.createElement('script')
    htmlExtension    = '.html'
    nameAndExtension = document.location.pathname.substring(document.location.pathname.lastIndexOf('/') + 1)
    fileName         = nameAndExtension.substring(nameAndExtension.length-5) === htmlExtension ? nameAndExtension                 :
                                                                                                 nameAndExtension + htmlExtension
    script.src       = 'https://api.github.com/repos/GreekLaw/gr/commits?path=' + fileName + '&page=1&per_page=1&callback=gitData'

    document.head.appendChild(script)
}()

function gitData(data){
    var months, noteOfUpdate, dateOfUpdate, dateText, updateText
    
    months       = ['Ιαν', 'Φεβ', 'Μαρ', 'Απρ', 'Μαϊ', 'Ιουν', 'Ιουλ', 'Αυγ', 'Σεπ', 'Οκτ', 'Νοε', 'Δεκ']
    noteOfUpdate = document.createElement('div')
    dateOfUpdate = new Date(data.data[0].commit.author.date)
    if (isNaN(dateOfUpdate.getTime())){ return }
    dateText     = dateOfUpdate.getUTCDate() + " " + months[dateOfUpdate.getUTCMonth()] + " " + dateOfUpdate.getUTCFullYear()
    updateText   = 'Τροποποίηση στις ' + dateText
    document.head.textContent ? noteOfUpdate.textContent = updateText :
    document.head.innerText   ? noteOfUpdate.innerText   = updateText :
                                ''      
    noteOfUpdate.className = 'last-updated'
    document.getElementsByTagName('header')[0].appendChild(noteOfUpdate)
}
