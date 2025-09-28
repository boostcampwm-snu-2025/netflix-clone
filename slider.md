func create_slider
input
num_card_view: number of cards shown
put num_card_view + 1 in the front which is the last elements of the original list.
pit num_card_view + 1 in the last which is the first elements of the original list.



input
num_card_view: number of cards shown

if never_clicked:
    there is no prev button

else:
    if next clicked:
        if this is last page:
            translate than immediately jump to first postion. 
            the user should not be able to notice the change.
        if current start index + num_card_view is larger than toal length:
            move until the last index
        else:
            give transition by card_width * num_card_view
    if next clicked:
        simlilar to prev clicked