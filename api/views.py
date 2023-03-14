from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from PIL import Image, ImageEnhance

# Create your views here.
@api_view(['GET'])
def getRoutes(request):
    # grid = []
    # for col in range(0, 50):
    #     grid.append([])
    #     for row in range(0, 97):
    #         if col == 1:
    #             grid[col].append(1)
    #         else:
    #             grid[col].append(0)

    img = Image.open("api/Maps/Map.png")

    img = (img.resize((97,50)))
    img = img.convert('L')

    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(1000000000)

    data = img.load()

    w, h = img.size
    gridInput = []
    for x in range(w):
        gridInputCol = []
        for y in range(h):
            if data[x, y] == 0:
                gridInputCol.append(0)
            else:
                gridInputCol.append(1)
        gridInput.append(gridInputCol)

    gridInput = [row[::-1] for row in gridInput]
    gridInput = [list(row[::-1]) for row in zip(*gridInput)]
    gridInput = [list(row[::-1]) for row in zip(*gridInput)]
    gridInput = [list(row[::-1]) for row in zip(*gridInput)]

    return Response(gridInput)

