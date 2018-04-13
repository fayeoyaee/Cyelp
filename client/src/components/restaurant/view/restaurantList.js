import React from 'react';
import {findRestaurant} from '../restaurantService';
import {checkLogin} from '../../user/userService';
import {Navbar, NavbarBrand, NavItem, NavLink, Nav, Jumbotron, Container } from 'reactstrap';

class RestaurantRow extends React.Component {
    render() {
        const restaurant = this.props.restaurant;

        return (
            <tr>
                <td>
                    <a href={"/restaurants/" + restaurant._id}>{restaurant.name}</a>
                </td>
                <td>{restaurant.address.zipcode}</td>
                <td>{restaurant.cuisine}</td>
                <td>{restaurant.averageRating}</td>
            </tr>
        );
    }
}

export class RestaurantTable extends React.Component {
    render() {
        const rows = [];
        this
            .props
            .restaurants
            .forEach((restaurant) => {
                rows.push(<RestaurantRow restaurant={restaurant} key={restaurant._id}/>);
            });

        return (
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Location</th>
                    <th>FoodType</th>
                    <th>AverageRating</th>
                </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        );
    }
}

// TODO: handle input field change in local state
class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            foodType: '',
            area: '',
            lowestRating: ''
        };
        this.handleChange = this
            .handleChange
            .bind(this);

        this.handleFoodTypeChange = this
            .handleFoodTypeChange
            .bind(this);
        this.handleAreaChange = this
            .handleAreaChange
            .bind(this);
        this.handleLowestRatingChange = this
            .handleLowestRatingChange
            .bind(this);
    }

    handleFoodTypeChange(e) {
        e.preventDefault();
        this
            .props
            .onFoodTypeChange(this.state.foodType);
        this.setState({foodType: ''})
    }

    handleAreaChange(e) {
        console.log("restaurantList 81")
        e.preventDefault();
        this
            .props
            .onAreaChange(this.state.area);
        this.setState({area: ''})
    }

    handleLowestRatingChange(e) {
        e.preventDefault();
        this
            .props
            .onLowestRatingChange(this.state.lowestRating);

        this.setState({lowestRating: ''})
    }

    handleChange(e) {
        e.preventDefault();
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    render() {
        return (
            <form>
                <p>
                    Search restaurants by food type {' '}
                    {/* TODO: value and onChange locally */}
                    <input
                        type="text"
                        name="foodType"
                        placeholder="food type (sichuan, hunan...)"
                        value={this.state.foodType}
                        onChange={this.handleChange}/>
                    <button onClick={this.handleFoodTypeChange}>Search</button>
                </p>
                <p>
                    Search restaurants by area {' '}
                    <input
                        type="text"
                        name="area"
                        placeholder="five digit zip code"
                        value={this.state.area}
                        onChange={this.handleChange}/>
                    <button onClick={this.handleAreaChange}>Search</button>
                </p>
                <p>
                    Search restaurants by lowest rating {' '}
                    <input
                        type="text"
                        name="lowestRating"
                        placeholder="lowest rating (0-5)"
                        value={this.state.lowestRating}
                        onChange={this.handleChange}/>
                    <button onClick={this.handleLowestRatingChange}>Search</button>
                </p>
            </form>
        );
    }
}

const jumbotronStyle = {
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundImage: `url(' /images/jumbotronImg.jpg ')`,
    backgroundPosition: "top center",
    minHeight: "300px",
    boxShadow: "0px 2px 3px rgba(0,0,0,0.2), 0px 6px 8px rgba(0,0,0,0.1), 0px 10px 15px rgba(0,0,0,0.1)"
};

export class RestaurantList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            foodType: '',
            area: '',
            lowestRating: '',
            restaurants: []
        };

        this.handleFoodTypeChange = this
            .handleFoodTypeChange
            .bind(this);
        this.handleAreaChange = this
            .handleAreaChange
            .bind(this);
        this.handleLowestRatingChange = this
            .handleLowestRatingChange
            .bind(this);
    }

    async componentDidMount() {
        await checkLogin().then((res) => {
            if (res._id !== null) {
                this.setState({isAuthenticated: true, userId: res._id})
            } else {}
        })
    }


    handleAreaChange(area) {
        var queryBody = {
            "address.zipcode": area
        };
        findRestaurant(queryBody).then((res) => {
            this.setState({restaurants: res.restaurants})
        })
    };

    handleLowestRatingChange(lowestRating) {
        var queryBody = {
            averageRating: {
                $gte: lowestRating
            }
        };

        findRestaurant(queryBody).then((res) => {
            this.setState({restaurants: res.restaurants})
        })
    }

    handleFoodTypeChange(foodType) {
        var queryBody = {
            cuisine: foodType
        };

        findRestaurant(queryBody).then((res) => {
            this.setState({restaurants: res.restaurants})
        })
    }

    render() {
        return (
            <div>
                <Navbar color="light" light expand="xs">
                    <NavbarBrand href="/restaurants">Cyelp</NavbarBrand>
                    <Nav className="ml-auto" navbar>
                        <NavItem>
                            <NavLink href="/login">Login</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href={"/user/"+this.state.userId}>Profile</NavLink>
                        </NavItem>
                    </Nav>
                </Navbar>
                <Jumbotron style={jumbotronStyle} fluid>
                    <Container fluid>
                        <p className="lead"></p>
                    </Container>
                </Jumbotron>
                <div className={"container"}>
                    <SearchBar
                        foodType={this.state.foodType}
                        area={this.state.area}
                        lowestRating={this.state.lowestRating}
                        onFoodTypeChange={this.handleFoodTypeChange}
                        onAreaChange={this.handleAreaChange}
                        onLowestRatingChange={this.handleLowestRatingChange}/>
                    <RestaurantTable restaurants={this.state.restaurants}/>
                </div>
            </div>
        );
    }
}
