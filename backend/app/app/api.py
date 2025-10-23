from ninja import NinjaAPI

from board.api import board_router


api = NinjaAPI(urls_namespace='api')

api.add_router('boards/', board_router)
