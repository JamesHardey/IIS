from deepface import DeepFace


def candidate_verification(image1,  image2):
    result = None
    
    img_result  = DeepFace.verify(image1, image2, enforce_detection = False)
    if img_result["verified"]:
        print('Successful')
        result = True

    else:
        error = 'Unable to verify'
        result = False

    return result
