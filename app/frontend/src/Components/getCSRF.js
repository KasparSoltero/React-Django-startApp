

function getCSRF() {
    return document.cookie.split('=')[1]
}

export default getCSRF