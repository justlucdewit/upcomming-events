source "$HOME/scripts/build.sh"

cmd="$1"

print_help() {
    echo "Usage: "
    echo "  events list"
    echo "  events add"
}

events_list() {
    local headers="Date,Event"
    local events=$(jq -r ".[] | .date + \",\" + .name" ./src/events.json)
    local table_body=()

    while IFS= read -r line; do
        table_body+=("$line")
    done <<< "$events"
    reset_ifs

    table "$headers" "${table_body[@]}"
}

events_add() {
  # Prompt the user for a name
  read -p "Enter the event name: " event_name

  # Prompt the user for a date
  read -p "Enter the event date (ex: 1 Jan 2025): " event_date

  # Create a new event object
  new_event=$(jq -n \
    --arg name "$event_name" \
    --arg date "$event_date" \
    '{name: $name, date: $date}')

  # Add the new event to the JSON file
    jq '. += [$new_event]' --argjson new_event "$new_event" "./src/events.json" > "./temp.json" && mv temp.json ./src/events.json
    echo "Event added successfully!"
}

if [[ "$#" == 0 ]]; then
    print_help
elif [[ "$cmd" == "list" ]]; then
    events_list
elif [[ "$cmd" == "add" ]]; then
    events_add
else
    print_error "Unknown command '$cmd'"
    print_help
fi