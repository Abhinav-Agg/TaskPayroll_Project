const app = require("./index");
const Port = 6060;

app.listen(Port, () => {
    console.log(`Server is listen at ${Port}`);
});