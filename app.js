// HTML SELECTORS
let cafeList = document.querySelector('#cafe-list')
let form = document.querySelector('#add-cafe-form')

// FUNCTIONS
const renderCafe = (doc) => {
  let li = document.createElement('li')
  let name = document.createElement('span')
  let city = document.createElement('span')
  let image = document.createElement('img')
  let cross = document.createElement('div')

  li.setAttribute('data-id', doc.id)
  // image.setAttribute('src', doc.data().image)
  name.textContent = doc.data().name
  city.textContent = doc.data().city
  cross.textContent = 'X'

  // li.appendChild(image)
  li.appendChild(name)
  li.appendChild(city)
  li.appendChild(cross)

  cafeList.appendChild(li)

  cross.addEventListener('click', (e) => {
    e.stopPropagation()
    let id = e.target.parentElement.getAttribute('data-id')
    deleteItem(id)
  })
}

const deleteCafe = (doc) => {
  let li = cafeList.querySelector(`[data-id=${doc.id}]`)
  cafeList.removeChild(li)
}

// CRUD

// CREATE
form.addEventListener('submit', (event) => {
  event.preventDefault()
  db.collection('cafes')
    .add({
      name: form.name.value,
      city: form.city.value,
      // image: form.image.value,
    })
    .then((snapshot) => {
      console.log('Saved to Firestore')
    })
})

// READ - REAL TIME LISTENER OF FIRESTORE DB
db.collection('cafes')
  .orderBy('city')
  .onSnapshot((snapshot) => {
    let changes = snapshot.docChanges()
    changes.forEach((change) => {
      // console.log(change.doc.data())
      if (change.type === 'added') renderCafe(change.doc)
      if (change.type === 'removed') deleteCafe(change.doc)
    })
  })

// UPDATE
const updateData = (id) => {
  db.collection('cafes')
    .doc(id) //id of document...
    .update({ name: 'Mokka' })
    .then(() => console.log('Updated from Firestore'))
}

// DELETE DOCUMENT OF FIRESTORE
const deleteItem = (id) => {
  db.collection('cafes')
    .doc(id)
    .delete()
    .then(() => console.log('Deleted from Firestore'))
}

// OTHER FUNCTIONS

// SET (Is equal to set method but it overrides fields even without content leaving the field undefined on db)
// db.collection('cafes').doc('47vnuDH0exlBdfMK6PlB').set({ name: 'Seted Field' })

// GET DATA FROM FIRESTORE
// let cafes = db
//   .collection('cafes')
//   .where('city', '==', 'London') //this allows to make queries....awesome (case sensitive)
//   .orderBy('name') //this allows to make order data by field....awesome (case sensitive)
//   .get()
//   .then((snapshot) => {
//     snapshot.docs.forEach((doc) => {
//       renderCafe(doc)
//     })
//   })
