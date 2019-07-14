#coding=utf-8
from flask import Flask, jsonify, request, send_file

import os
import subprocess
from config import *
from image_handler import *

app = Flask(__name__)


@app.route('/test', methods=['GET'])
def test_connection():
    return 'connected!'


@app.route('/image', methods=['POST'])
def convert_image():
    image = request.files.get('image')
    if not image:
        return jsonify({
            'status': 'failed', 
            'message': INVALIDUPLOAD}), 400

    style = request.form.get('style')
    style_image = os.path.join(ROOT_DIR+STYLE_DIR, f'{style}.jpg')
    if not os.path.exists(style_image):
        return jsonify({
            'status': 'failed', 
            'message': INVALIDSTYLE}), 400
    
    status, image_filename = save_image_to_local(image, ROOT_DIR+CONTENT_DIR, 'stylus')
    if status != SUCCESS:
        return jsonify({'status': 'failed', 'message': status}), 400
    image_relative_filename = CONTENT_DIR + os.path.basename(image_filename)
    style_relative_filename = STYLE_DIR + os.path.basename(style_image)
    cmd = f'/usr/local/bin/th style-swap.lua --gpu 1 --content {image_relative_filename} --style {style_relative_filename}'
    p = subprocess.Popen(cmd, shell=True, cwd=ROOT_DIR, stdout=subprocess.PIPE)
    p.wait()

    name, ext = os.path.splitext(os.path.basename(image_filename))
    stylized_image = f'{OUTPUT_DIR}{name}_stylized{ext}'
    image_path = save_image_to_oss(stylized_image, OSS_IMAGE_DIR)

    return jsonify({'status': 'success', 'imgurl': f'{OSS_IMAGE_PREFIX_URL}/{image_path}'})


if __name__ == '__main__':
    app.run(host=HOST, port=PORT, debug=True)


# ssh -NL 10.15.89.41:32602:0.0.0.0:32602 node15