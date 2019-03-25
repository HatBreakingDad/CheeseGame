# CheeseGame

Very cool game.

# Data Structures

#### Player

Field | Type | Description
-|-|-
x | float | the player's x position
y | float | the player's y position
velocity | object | the player's velocity
items | array | list of the player's items

```json
{
  "x": 861.85,
  "y": 701.96,
  "velocity": {"x": 12.23, "y": 2.37},
  "items": []
}
```

#### Item

Field | Type | Description
-|-|-
type | string | item type
name | string | item name
rarity | integer | rarity of the item

# Events

## Client

#### PLAYER_UPDATE

Field | Type | Description
-|-|-
keys | object | the keys the user is currently pressing
mouse | object | the position and click status of the user's mouse

```json
{
  "type": "PLAYER_UPDATE",
  "keys": {"87": true},
  "mouse": {"x": 259, "y": 525, "click": true}
}
```

## Server

#### READY

Field | Type | Description
-|-|-
user_id | integer | the user's id
lobby_id | integer | the id of the lobby the user is in
players | object | list of players in the user's lobby

```json
{
  "type": "READY",
  "user_id": 27,
  "lobby_id": 4,
  "players": {
    "5": {"structure": "user"},
    "12": {"structure": "user"} 
  }
}
```

#### UPDATE

Field | Type | Description
-|-|-
players | object | list of players in the user's lobby

```json
{
  "players": {
    "5": {"structure": "user"},
    "12": {"structure": "user"}
  }
}
```

# Other

### Rarity Scale

Name | Value | Colour
-|-|-
Common | 10 | Gray
Uncommon | 20 | Green
Rare | 30 | Blue
Epic | 40 | Purple
Legendary | 50 | Orange
