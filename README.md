// our commit  message
# Auction

A simple auction project implemented in the SUI Move language.

## Overview

This project demonstrates a basic auction smart contract using Move. It allows users to place bids and determines the winner after the auction ends.

## Features

- Start and end auctions
- Place bids
- Track highest bidder and bid
- Secure fund handling

## Getting Started

1. **Clone the repository:**
    ```sh
    git clone https://github.com/yourusername/Auction.git
    cd Auction
    ```

2. **Build the Move package:**
    ```sh
    sui move build
    ```

3. **Run tests:**
    ```sh
   sui move test
    ```

## Project Structure

- `sources/` - Move modules and scripts
- `tests/` - Test cases for the auction logic

## Requirements

- [Move CLI](https://github.com/move-language/move)
- Rust (for building Move tools)

## License

MIT
