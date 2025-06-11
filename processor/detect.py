import sys
import json
import os
from pathlib import Path
from PIL import Image
import torch
from ultralyticsplus import YOLO, render_result
from ultralytics.nn.tasks import DetectionModel
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add the safe globals before loading the model
torch.serialization.add_safe_globals([DetectionModel])

# Configure torch to load the model with weights_only=False
original_torch_load = torch.load
torch.load = lambda f, *args, **kwargs: original_torch_load(f, *args, weights_only=False, **kwargs)

def detect_helmets(image_path):
    # Load model
    model = YOLO('keremberke/yolov8n-hard-hat-detection')
    
    # Log available classes
    logger.info(f"Model classes: {model.names}")

    # set model parameters
    model.overrides['conf'] = 0.25  # NMS confidence threshold
    model.overrides['iou'] = 0.45  # NMS IoU threshold
    model.overrides['agnostic_nms'] = False  # NMS class-agnostic
    model.overrides['max_det'] = 1000  # maximum number of detections per image

    # Ensure the detections directory exists
    detections_dir = '/shared/uploads/detections'
    os.makedirs(detections_dir, exist_ok=True)

    # Run prediction
    results = model.predict(
        source=image_path,
        save=False,  # Save manually after rendering
        imgsz=640,  # Default size
    )

    # Get the path for the annotated image
    base_name = os.path.basename(image_path)
    annotated_image_path = os.path.join(detections_dir, base_name)

    # Render results with bounding boxes
    render = render_result(model=model, image=image_path, result=results[0])
    render.save(annotated_image_path)

    # Process detection results
    detections = []
    helmet_count = 0
    no_helmet_count = 0
    
    for result in results:
        boxes = result.boxes
        for box in boxes:
            cls = int(box.cls[0])
            label = model.names[cls]
            conf = float(box.conf[0])
            xyxy = box.xyxy[0].tolist()

            # Log each detection for debugging
            logger.info(f"Detected {label} with confidence {conf:.2f}")

            detection = {
                'label': label,
                'confidence': round(conf, 3),
                'bbox': [round(x, 2) for x in xyxy]
            }
            detections.append(detection)
            
            # Count helmet vs no_helmet
            if label == 'Hardhat':
                helmet_count += 1
            elif label == 'NO-Hardhate':
                no_helmet_count += 1

    # Prepare response
    response = {
        'annotated_image_path': annotated_image_path,
        'detections': detections,
        'total_detections': len(detections),
        'helmet_count': helmet_count,
        'no_helmet_count': no_helmet_count,
        'model_classes': model.names  # Include available classes in response
    }

    return response

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python detect.py <image_path>", file=sys.stderr)
        sys.exit(1)

    image_path = sys.argv[1]

    if not os.path.exists(image_path):
        print(f"File not found: {image_path}", file=sys.stderr)
        sys.exit(1)

    results = detect_helmets(image_path)
    print(json.dumps(results))
