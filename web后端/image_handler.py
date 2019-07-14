#coding=utf-8
import os
import hashlib

from config import *
from oss_api import get_ossfile_client

SUCCESS = 0
WRONGSIZE = 1
WRONGTYPE = 2
INVALIDUPLOAD = 3
INVALIDSTYLE = 4

def allow_image_format(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in ["jpg", "jpeg", "png"]


# def allow_image_size(_file):
#     return len(_file.body) <= 2*1024*1024


def hash_str(text):
        return hashlib.md5(text.encode('utf-8')).hexdigest()


def save_image_to_local(file_, storge_path, key):
    if not allow_image_format(file_.filename):
        return WRONGTYPE, None
    # if not allow_image_size(file_):
    #     return WRONGSIZE, None
    
    name, ext = os.path.splitext(file_.filename)
    seed = hash_str(name + key)
    image_filename = os.path.join(storge_path, seed + ext)
    # write
    file_.save(image_filename)
    return SUCCESS, image_filename


def save_image_to_oss(file_, storge_path):
    # write
    image_filename = os.path.join(storge_path, os.path.basename(file_))
    ossfile = get_ossfile_client(auth=(OSS_ACCESS_KEY_ID, OSS_ACCESS_KEY_SECRET),
                                endpoint=OSS_ENDPOINT, bucket_name=OSS_BUCKET)
    ossfile.upload_file(file_, image_filename)

    return image_filename