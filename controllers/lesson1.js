
const mainRoute = (req, res) => {
    res.send("Elijah Foard");
};
const secondaryRoute = (req, res) => {
    res.send("James Foard");
};

module.exports = {
    mainRoute,
    secondaryRoute
}