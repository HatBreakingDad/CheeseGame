# CheeseGame

Very cool game.

# Structures

#### Player

Field | Type | Description
-|-|-
x | number | the player's x position
y | number | the player's y position
velocity | object | the player's velocity
input | object | the player's mouse and keyboard input
items | array | list of the player's items
halfwidth | number | half of the user's canvas width
halfheight | number | half of the user's canvas height

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
rarity | number | rarity of the item

# Events

## Client

These are the events 

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
user_id | number | the user's id
players | object | list of players in the user's lobby

```json
{
  "type": "READY",
  "user_id": 27,
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
  "type": "UPDATE",
  "players": {
    "5": {},
    "12": {}
  }
}
```

# Other

### Rarity Scale

Name | Value | Colour
-|-|-
Common | 10 | Gray
Rare | 20 | Green
Super Rare | 30 | Blue
