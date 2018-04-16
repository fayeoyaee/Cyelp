export function createReview(restaurantId, content, rating, price) {
    var newReview = {
        restaurantId: restaurantId,
        content: content,
        rating: rating,
        price: price,
    }

    return fetch('/api/restaurant/' + restaurantId + '/review', {
        method: 'POST',
        credentials: "same-origin",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newReview)
    })
}

export function findReviewsByUserId() {
    // TODO: get reviews
    return fetch('/api/restaurant/' + restaurantId + '/review', {
        method: 'GET',
        credentials: "same-origin",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newReview)
    })
}
