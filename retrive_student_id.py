from pandas import *
import csv
 
# reading CSV file
data = read_csv("resources/data.csv")
 
# converting column data to list
ids = data['Id'].tolist()
passwords = data['Password'].tolist()
img_urls = data['Image Url'].tolist()



def find_matric_no(matric_no, passw):
    for index,id in enumerate(ids):
        if matric_no.lower() == id.lower():

            if str(passwords[index]) == passw:
                return True,id

            else:
                print('Wrong password')
                return False, None
            break


def get_image_url(matric_no):
    img_url = ''
    for index,id in enumerate(ids):
        if matric_no.lower() == id.lower():
            img_url=img_urls[index]
            break
    
    return img_url

# find_matric_no('sci17csc080', '111111')


