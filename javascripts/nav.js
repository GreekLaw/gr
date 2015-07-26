void function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
}(window,document,'script','//www.google-analytics.com/analytics.js','ga')

ga('create', 'UA-33952776-3', 'greeklaw.github.io')
ga('require', 'displayfeatures')
ga('send', 'pageview')

document.addEventListener('click', handleIt)

function handleIt(event){
    var id, controlOf, reference, description

    id          = event.target.id
    controlOf   = event.target.getAttribute('data-controls')
    reference   = document.getElementById(controlOf)

    description = id        ? id                                         :
                  reference ? reference.name + ':' + reference.className :
                              null
    description ? ga('send', 'event', decodeURI(location.pathname.match(/.+\/(.+?)\.html?$/)[1]), 'click', description, {'nonInteraction': 1}) :
                  void Function
}

function gitData(data){
    var months, noteOfUpdate, dateOfUpdate, dateText
    
    months       = ['Ιαν', 'Φεβ', 'Μαρ', 'Απρ', 'Μαϊ', 'Ιουν', 'Ιουλ', 'Αυγ', 'Σεπ', 'Οκτ', 'Νοε', 'Δεκ']
    noteOfUpdate = document.createElement('div')
    dateOfUpdate = new Date(data.data[0].commit.author.date)
    if (isNaN(dateOfUpdate.getTime())){ return }
    dateText     = dateOfUpdate.getUTCDate() + " " + months[dateOfUpdate.getUTCMonth()] + " " + dateOfUpdate.getUTCFullYear()
    noteOfUpdate.innerHTML = 'Τροποποίηση στις ' + dateText
    noteOfUpdate.className = "last-updated"
    document.getElementsByTagName('header')[0].appendChild(noteOfUpdate)
}

void function getUpdateDate(gitData){
    var script, fileName
    
    script     = document.createElement('script')
    fileName   = document.location.pathname.substring(document.location.pathname.lastIndexOf('/') + 1)
    script.src = 'https://api.github.com/repos/GreekLaw/gr/commits?path=' + fileName + '&page=1&per_page=1&callback=gitData'
    document.head.appendChild(script)
}()
