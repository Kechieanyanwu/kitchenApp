const express = requier('express');
const app = express();
const PORT = process.env.PORT || 4002

app.listen(PORT, () => {
    console.log(`Kitchen App is listening on port ${PORT}`)
})