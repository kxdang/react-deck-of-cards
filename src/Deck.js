import React, { Component } from "react";
import Card from "./Card";
import "./Deck.css";
import axios from "axios";

const API_BASE_URL = "https://deckofcardsapi.com/api/deck";

export default class Deck extends Component {
  constructor(props) {
    super(props);
    this.state = { deck: null, drawn: [], remainingCards: 52 };

    this.getCard = this.getCard.bind(this);
  }

  async componentDidMount() {
    let deck = await axios.get(`${API_BASE_URL}/new/shuffle/`);

    this.setState({ deck: deck.data });
  }

  async getCard() {
    //make request using deck id
    let deck_id = this.state.deck.deck_id;

    try {
      let cardUrl = `${API_BASE_URL}/${deck_id}/draw/`;
      let cardRes = await axios.get(cardUrl); //returns an object with data {deck_id, remaining, success}

      if (!cardRes.data.success) {
        throw new Error("No Cards Remaining");
      }

      let card = cardRes.data.cards[0]; //will return an object
      let cardRemaining = cardRes.data.remaining;

      this.setState(st => ({
        drawn: [
          ...st.drawn,
          {
            id: card.code,
            image: card.image,
            name: ` ${card.value} OF ${card.suit}`
          }
        ],
        remainingCards: cardRemaining
      }));
    } catch (err) {
      alert(err);
    }
  }

  render() {
    const cards = this.state.drawn.map(c => (
      <Card name={c.name} image={c.image} key={c.code} />
    ));
    return (
      <div>
        <h1>Deck Dealer</h1>
        <button onClick={this.getCard}>Get Card!</button>
        <p>Remaining Cards: {this.state.remainingCards}</p>
        <div className="Deck-cardarea">{cards}</div>
        <div className="Deck-remainingCards"></div>
      </div>
    );
  }
}
