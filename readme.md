# Therapy Box - Take-home Assessment

## Requirements

### Login Page

User can log into the application to use the features.
| Form Fields |
|:------------|
| Username |
| Password |

### Register Page

User can create an account and add a profile picture.
| Form Fields |
|:-----------------|
| Username |
| Email |  
| Password |
| Confirm Password |

### Homepage - dashboard

Displays a welcome message with username and profile picture.
Additionally, the page outputs 6 cards each with a different functionality.

Cards include:

- Weather - Outputs users location with current weather. Icon to indicate weather and temperature in celsius.
- News - Displays news article's headline and description. Is clickable and navigates to the News page.
- Sport - Shows a winning team's name and score. Is clickable and navigates to the Sport page.
- Photos - Outputs 4 images added by a user. Is clickable and navigates to the Photo Gallery page.
- Tasks - Shows first 3 tasks and their status. Is clickable and navigates to the Tasks page.
- Clothes - Displays a pie chart with favourite types of clothing.

### News Page

Outputs articles image, headline, and text.

Article data retrieved from an API.

### Sport Page

Displays a text input that allows the user to enter football teams name.

When name is entered the list outputs teams that were beaten.

Data retrieved from a CSV file.

### Photos Page

Shows a photo library.

Allows the user to add images from local device and optionaly remove them.

Stored images are resized to 280 \* 280.

### Tasks Page

Outputs a list of tasks, which when clicked are an input field.

Beside the input field is a status checkbox that allows to mark/unmark the tasks as completed/incompleted.
